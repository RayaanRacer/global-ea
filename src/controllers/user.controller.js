import asyncHandler from "express-async-handler";
import { db } from "../db/index.js";
import { rides, userLogin, users } from "../db/schema.js";
import jwt from "jsonwebtoken";
import { and, eq, or, sql, ilike, gte } from "drizzle-orm";
import { randomUUID } from "crypto";
import bcrypt from "bcryptjs";

export const userLoginController = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const [isUserExists] = await db
    .select()
    .from(users)
    .where(eq(users.email, email));

  if (!isUserExists) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  const [userCredentials] = await db
    .select()
    .from(userLogin)
    .where(eq(userLogin.userId, isUserExists.id));

  if (!userCredentials) {
    return res.status(401).json({
      success: false,
      message: "Invalid credentials",
    });
  }

  const isPasswordValid = await bcrypt.compare(
    password,
    userCredentials.password,
  );

  if (!isPasswordValid) {
    return res.status(401).json({
      success: false,
      message: "Invalid credentials",
    });
  }

  const userData = {
    id: isUserExists.id,
    email: isUserExists.email,
    name: `${isUserExists.firstName} ${isUserExists.lastName}`,
    role: isUserExists.role,
  };
  const accessToken = jwt.sign(userData, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  return res.status(200).json({
    success: true,
    message: "Login successful",
    data: {
      user: userData,
      accessToken: accessToken,
    },
  });
});

export const userCreateRiderController = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, phone, password } = req.body;

  const [isUserExists] = await db
    .select()
    .from(users)
    .where(
      or(
        eq(users.email, email?.trim().toLowerCase()),
        eq(users.phone, phone?.trim()),
      ),
    );

  console.log(isUserExists);

  if (isUserExists) {
    return res.status(409).json({
      success: false,
      message: "User already exists",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await db.transaction(async (tx) => {
    const result = await tx.insert(users).values({
      uuid: randomUUID(),
      firstName: firstName?.trim(),
      lastName: lastName?.trim(),
      email: email?.trim().toLowerCase(),
      phone: phone?.trim(),
      role: "RIDER",
      status: "ACTIVE",
    });

    const userId = result[0].insertId; // or result.insertId depending on your Drizzle version

    const [createdUser] = await tx
      .select()
      .from(users)
      .where(eq(users.id, userId));

    await tx.insert(userLogin).values({
      userId,
      password: hashedPassword,
      email: email?.trim().toLowerCase(),
    });

    return createdUser;
  });

  return res.status(201).json({
    success: true,
    message: "Rider created successfully",
    data: {
      id: newUser.id,
      email: newUser.email,
      name: `${newUser.firstName} ${newUser.lastName}`,
      role: newUser.role,
    },
  });
});

export const userUpdateRiderController = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, email, phone, password } = req.body;

  const [existingUser] = await db
    .select()
    .from(users)
    .where(eq(users.id, Number(id)));

  if (!existingUser) {
    return res.status(404).json({
      success: false,
      message: "Rider not found",
    });
  }
  if (email) {
    const [emailExists] = await db
      .select()
      .from(users)
      .where(
        and(
          eq(users.email, email.trim().toLowerCase()),
          ne(users.id, Number(id)),
        ),
      );

    if (emailExists && emailExists.id !== Number(id)) {
      return res.status(409).json({
        success: false,
        message: "Email already exists",
      });
    }
  }

  const updatedUser = await db.transaction(async (tx) => {
    const [user] = await tx
      .update(users)
      .set({
        firstName: firstName?.trim(),
        lastName: lastName?.trim(),
        email: email?.trim().toLowerCase(),
        phone: phone?.trim(),
        updatedAt: new Date(),
      })
      .where(eq(users.id, Number(id)))
      .returning();

    const loginUpdateData = {};

    if (email) {
      loginUpdateData.email = email.trim().toLowerCase();
    }

    if (password) {
      loginUpdateData.password = await bcrypt.hash(password, 10);
    }

    if (Object.keys(loginUpdateData).length > 0) {
      await tx
        .update(userLogin)
        .set(loginUpdateData)
        .where(eq(userLogin.userId, Number(id)));
    }

    return user;
  });

  return res.status(200).json({
    success: true,
    message: "Rider updated successfully",
    data: {
      id: updatedUser.id,
      email: updatedUser.email,
      name: `${updatedUser.firstName} ${updatedUser.lastName}`,
      role: updatedUser.role,
    },
  });
});

export const getRiderById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, Number(id)));

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "Rider not found",
    });
  }

  return res.status(200).json({
    success: true,
    message: "Rider found",
    data: {
      id: user.id,
      email: user.email,
      name: `${user.firstName} ${user.lastName}`,
      role: user.role,
    },
  });
});

export const getAllRidersController = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const search = req.query.search?.trim() || "";

  const offset = (page - 1) * limit;

  const conditions = [eq(users.role, "RIDER")];

  if (search) {
    conditions.push(
      or(
        ilike(users.firstName, `%${search}%`),
        ilike(users.lastName, `%${search}%`),
        ilike(users.email, `%${search}%`),
        ilike(users.phone, `%${search}%`),
      ),
    );
  }

  const whereCondition = and(...conditions);

  const [totalResult] = await db
    .select({
      count: sql`count(*)`.mapWith(Number),
    })
    .from(users)
    .where(whereCondition);

  const riders = await db
    .select({
      id: users.id,
      firstName: users.firstName,
      lastName: users.lastName,
      email: users.email,
      phone: users.phone,
      status: users.status,
      role: users.role,
      createdAt: users.createdAt,
    })
    .from(users)
    .where(whereCondition)
    .limit(limit)
    .offset(offset)
    .orderBy(sql`${users.createdAt} DESC`);

  return res.status(200).json({
    success: true,
    data: riders,
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

export const updatePasswordController = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({
      success: false,
      message: "Current password and new password are required",
    });
  }

  const [userCredential] = await db
    .select()
    .from(userLogin)
    .where(eq(userLogin.userId, Number(id)));

  if (!userCredential) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  const isPasswordValid = await bcrypt.compare(
    currentPassword,
    userCredential.password,
  );

  if (!isPasswordValid) {
    return res.status(400).json({
      success: false,
      message: "Current password is incorrect",
    });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await db
    .update(userLogin)
    .set({
      password: hashedPassword,
    })
    .where(eq(userLogin.userId, Number(id)));

  return res.status(200).json({
    success: true,
    message: "Password updated successfully",
  });
});

export const getAdminDashboard = async (req, res) => {
  try {
    const { fromDate, toDate } = req.query;
    const user = req.user;

    const baseConditions = [];

    // Date Filters
    if (fromDate) {
      baseConditions.push(gte(rides.createdAt, new Date(fromDate)));
    }

    if (toDate) {
      const endDate = new Date(toDate);
      endDate.setHours(23, 59, 59, 999);

      baseConditions.push(lte(rides.createdAt, endDate));
    }

    const isAdmin = ["ADMIN"].includes(user.role);

    if (!isAdmin) {
      baseConditions.push(eq(rides.riderId, user.id));
    }

    // Pending Rides
    const pendingRides = await db
      .select({
        rideId: rides.id,
        riderId: rides.riderId,
        riderName:
          sql`CONCAT(COALESCE(${users.firstName}, ''), ' ', COALESCE(${users.lastName}, ''))`.as(
            "riderName",
          ),
        pickupAddress: rides.pickupAddress,
        dropAddress: rides.dropAddress,
        estimatedFare: rides.estimatedFare,
        requestedAt: rides.requestedAt,
        status: rides.status,
      })
      .from(rides)
      .leftJoin(users, eq(users.id, rides.riderId))
      .where(and(eq(rides.status, "REQUESTED"), ...baseConditions));

    // Active Rides Counter
    const activeRidesResult = await db
      .select({
        count: sql`COUNT(*)`.as("count"),
      })
      .from(rides)
      .where(and(eq(rides.status, "ACTIVE"), ...baseConditions));

    // Completed Rides Counter
    const completedRidesResult = await db
      .select({
        count: sql`COUNT(*)`.as("count"),
      })
      .from(rides)
      .where(and(eq(rides.status, "COMPLETED"), ...baseConditions));

    // Total Rides Counter
    const totalRidesResult = await db
      .select({
        count: sql`COUNT(*)`.as("count"),
      })
      .from(rides)
      .where(baseConditions.length ? and(...baseConditions) : undefined);

    return res.status(200).json({
      success: true,
      data: {
        filters: {
          fromDate: fromDate || null,
          toDate: toDate || null,
        },
        counters: {
          totalRides: Number(totalRidesResult[0]?.count || 0),
          currentActiveRides: Number(activeRidesResult[0]?.count || 0),
          completedRides: Number(completedRidesResult[0]?.count || 0),
          pendingRides: pendingRides.length,
        },
        pendingRides,
      },
    });
  } catch (error) {
    console.error("Dashboard Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};
