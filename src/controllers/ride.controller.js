import { and, asc, desc, eq, sql } from "drizzle-orm";
import asyncHandler from "express-async-handler";
import { db } from "../db/index.js";
import { rides, users, rideLocationLogs } from "../db/schema.js";
import { getIO } from "../socket.js";

export const createRideController = asyncHandler(async (req, res) => {
  const {
    riderId,
    pickupAddress,
    dropAddress,
    pickupLatitude,
    pickupLongitude,
    dropLatitude,
    dropLongitude,
    distanceKm,
    estimatedFare,
    rideType,
    paymentMethod,
  } = req.body;

  const [rider] = await db.select().from(users).where(eq(users.id, riderId));

  if (!rider) {
    return res.status(404).json({
      success: false,
      message: "Rider not found",
    });
  }

  if (rider.role !== "RIDER") {
    return res.status(400).json({
      success: false,
      message: "Invalid rider selected",
    });
  }

  const result = await db.insert(rides).values({
    riderId,

    pickupAddress: pickupAddress?.trim(),
    dropAddress: dropAddress?.trim(),

    pickupLatitude,
    pickupLongitude,

    dropLatitude,
    dropLongitude,

    distanceKm,
    estimatedFare,

    rideType: rideType || "STANDARD",
    paymentMethod: paymentMethod || "CASH",

    status: "REQUESTED",
    paymentStatus: "PENDING",
  });

  const rideId = result[0].insertId;

  const [ride] = await db.select().from(rides).where(eq(rides.id, rideId));

  getIO()
    .to("admins")
    .emit("ride:created", {
      rideId: Number(rideId),
      status: "CREATED",
      acceptedAt: new Date(),
    });
  return res.status(201).json({
    success: true,
    message: "Ride created successfully",
    data: ride,
  });
});

export const dispatchRideController = asyncHandler(async (req, res) => {
  const { id: rideId } = req.params;

  const [ride] = await db
    .select()
    .from(rides)
    .where(eq(rides.id, Number(rideId)));

  if (!ride) {
    return res.status(404).json({
      success: false,
      message: "Ride not found",
    });
  }

  if (ride.status !== "REQUESTED") {
    return res.status(400).json({
      success: false,
      message: `Ride cannot be dispatched. Current status is ${ride.status}`,
    });
  }

  if (ride.riderId !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: "You are not authorized to dispatch this ride",
    });
  }

  await db
    .update(rides)
    .set({
      status: "DISPATCHED",
      acceptedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(rides.id, Number(rideId)));

  getIO()
    .to("admins")
    .emit("ride:dispatched", {
      rideId: Number(rideId),
      status: "DISPATCHED",
      acceptedAt: new Date(),
    });

  return res.status(200).json({
    success: true,
    message: "Ride dispatched successfully",
  });
});

export const updateRideLocationController = asyncHandler(async (req, res) => {
  const { id: rideId } = req.params;

  const { latitude, longitude, speed, heading } = req.body;

  if (!latitude || !longitude) {
    return res.status(400).json({
      success: false,
      message: "Latitude and longitude are required",
    });
  }

  const [ride] = await db
    .select()
    .from(rides)
    .where(and(eq(rides.id, Number(rideId)), eq(rides.riderId, req.user.id)));

  if (!ride) {
    return res.status(404).json({
      success: false,
      message: "Ride not found",
    });
  }

  if (ride.status !== "DISPATCHED" && ride.status !== "STARTED") {
    return res.status(400).json({
      success: false,
      message: "Location can only be updated for active rides",
    });
  }

  const result = await db.insert(rideLocationLogs).values({
    rideId: Number(rideId),
    latitude,
    longitude,
    speed,
    heading,
  });

  getIO()
    .to("admins")
    .emit("ride:location", {
      rideId: Number(rideId),
      latitude,
      longitude,
      speed,
      heading,
      timestamp: new Date(),
    });

  return res.status(200).json({
    success: true,
    message: "Location updated successfully",
    data: {
      id: result[0]?.insertId,
      rideId: Number(rideId),
      latitude,
      longitude,
    },
  });
});

export const completeRideController = asyncHandler(async (req, res) => {
  const { id: rideId } = req.params;

  const [ride] = await db
    .select()
    .from(rides)
    .where(and(eq(rides.id, Number(rideId)), eq(rides.riderId, req.user.id)));

  if (!ride) {
    return res.status(404).json({
      success: false,
      message: "Ride not found",
    });
  }

  if (ride.status !== "DISPATCHED" && ride.status !== "STARTED") {
    return res.status(400).json({
      success: false,
      message: "Only dispatched or started rides can be completed",
    });
  }

  await db
    .update(rides)
    .set({
      status: "COMPLETED",
      completedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(rides.id, Number(rideId)));

  getIO()
    .to("admins")
    .emit("ride:completed", {
      rideId: Number(rideId),
      status: "COMPLETED",
      completedAt: new Date(),
    });

  return res.status(200).json({
    success: true,
    message: "Ride completed successfully",
  });
});

export const getRidesListController = asyncHandler(async (req, res) => {
  const { status, riderId } = req.query;
  const user = req.user;

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  const filters = [];

  if (user.role === "RIDER") {
    filters.push(eq(rides.riderId, user.id));
  }

  if (status) {
    filters.push(eq(rides.status, status));
  }

  if (riderId) {
    filters.push(eq(rides.riderId, Number(riderId)));
  }

  const whereCondition = filters.length > 0 ? and(...filters) : undefined;

  const [totalResult] = await db
    .select({
      count: sql`count(*)`.mapWith(Number),
    })
    .from(rides)
    .where(whereCondition);

  const ridesList = await db
    .select()
    .from(rides)
    .where(whereCondition)
    .orderBy(desc(rides.createdAt))
    .limit(limit)
    .offset(offset);

  return res.status(200).json({
    success: true,
    message: "Rides retrieved successfully",
    data: ridesList,
    pagination: {
      page,
      limit,
      totalRecords: totalResult.count,
      totalPages: Math.ceil(totalResult.count / limit),
      hasNextPage: page < Math.ceil(totalResult.count / limit),
      hasPreviousPage: page > 1,
    },
  });
});

export const getRideDetailsController = asyncHandler(async (req, res) => {
  const { id: rideId } = req.params;

  const [ride] = await db
    .select()
    .from(rides)
    .where(eq(rides.id, Number(rideId)));

  if (!ride) {
    return res.status(404).json({
      success: false,
      message: "Ride not found",
    });
  }

  const locations = await db
    .select()
    .from(rideLocationLogs)
    .where(eq(rideLocationLogs.rideId, Number(rideId)))
    .orderBy(asc(rideLocationLogs.recordedAt));

  const routeCoordinates = locations.map((item) => ({
    latitude: Number(item.latitude),
    longitude: Number(item.longitude),
  }));

  return res.status(200).json({
    success: true,
    data: {
      ride,
      locationLogs: locations,
      routeCoordinates,
      totalLocationPoints: locations.length,
    },
  });
});
