import { Request, Response } from 'express';
import User from '../user/user.model';
import { Booking } from '../bookings/booking.model';
import { Service } from '../services/service.model';
import httpStatus from 'http-status';

// Simple catchAsync utility
const catchAsync = (fn: Function) => {
  return (req: Request, res: Response, next: any) => {
    Promise.resolve(fn(req, res, next)).catch((err) => next(err));
  };
};

// Simple sendResponse utility
const sendResponse = (
  res: Response,
  data: {
    statusCode: number;
    success: boolean;
    message: string;
    data?: any;
    error?: string;
  }
) => {
  res.status(data.statusCode).json({
    success: data.success,
    message: data.message || null,
    data: data.data || null,
    error: data.error || null,
  });
};

const getDashboardStats = catchAsync(async (req: Request, res: Response) => {
  try {
    // Get total users count
    const totalUsers = await User.countDocuments({ role: 'buyer' });
    
    // Get total revenue from paid bookings
    const totalRevenue = await Booking.aggregate([
      { $match: { payment_status: 'Paid' } },
      {
        $lookup: {
          from: 'services',
          localField: 'service',
          foreignField: '_id',
          as: 'service'
        }
      },
      { $unwind: '$service' },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$service.price' }
        }
      }
    ]);

    const revenue = totalRevenue.length > 0 ? totalRevenue[0].totalRevenue : 0;

    // Format the stats as required
    const stats = {
      totalUsers: totalUsers,
      totalRevenue: revenue
    };

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Dashboard stats retrieved successfully',
      data: stats,
    });
  } catch (error) {
    sendResponse(res, {
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      success: false,
      message: 'Error retrieving dashboard stats',
      error: (error as Error).message,
    });
  }
});

const getUserGrowth = catchAsync(async (req: Request, res: Response) => {
  try {
    const { year } = req.query;
    
    if (!year || isNaN(Number(year))) {
      return sendResponse(res, {
        statusCode: httpStatus.BAD_REQUEST,
        success: false,
        message: 'Valid year parameter is required',
      });
    }

    const targetYear = Number(year);
    const startDate = new Date(`${targetYear}-01-01T00:00:00.000Z`);
    const endDate = new Date(`${targetYear}-12-31T23:59:59.999Z`);

    // Aggregate users by month for the specified year
    const monthlyUserGrowth = await User.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startDate,
            $lte: endDate,
          },
        },
      },
      {
        $group: {
          _id: {
            month: { $month: '$createdAt' },
            year: { $year: '$createdAt' },
          },
          totalUsers: { $sum: 1 },
        },
      },
      {
        $sort: { '_id.month': 1 },
      },
    ]);

    // Initialize all months with 0 users
    const monthlyData = [
      { month: 'Jan', totalUsers: 0 },
      { month: 'Feb', totalUsers: 0 },
      { month: 'Mar', totalUsers: 0 },
      { month: 'Apr', totalUsers: 0 },
      { month: 'May', totalUsers: 0 },
      { month: 'Jun', totalUsers: 0 },
      { month: 'Jul', totalUsers: 0 },
      { month: 'Aug', totalUsers: 0 },
      { month: 'Sep', totalUsers: 0 },
      { month: 'Oct', totalUsers: 0 },
      { month: 'Nov', totalUsers: 0 },
      { month: 'Dec', totalUsers: 0 },
    ];

    // Map the aggregated data to the monthly data
    monthlyUserGrowth.forEach((item) => {
      const monthIndex = item._id.month - 1;
      if (monthIndex >= 0 && monthIndex < 12) {
        monthlyData[monthIndex].totalUsers = item.totalUsers;
      }
    });

    const totalUsers = monthlyData.reduce((sum, item) => sum + item.totalUsers, 0);

    // If no users found for the year, provide sample data for demonstration
    if (totalUsers === 0) {
      const sampleData = [
        { month: 'Jan', totalUsers: 680 },
        { month: 'Feb', totalUsers: 380 },
        { month: 'Mar', totalUsers: 780 },
        { month: 'Apr', totalUsers: 550 },
        { month: 'May', totalUsers: 440 },
        { month: 'Jun', totalUsers: 820 },
        { month: 'Jul', totalUsers: 550 },
        { month: 'Aug', totalUsers: 600 },
        { month: 'Sep', totalUsers: 820 },
        { month: 'Oct', totalUsers: 720 },
        { month: 'Nov', totalUsers: 550 },
        { month: 'Dec', totalUsers: 780 },
      ];

      sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'User growth data retrieved successfully (sample data shown as no real data found)',
        data: {
          year: targetYear,
          totalUsers: sampleData.reduce((sum, item) => sum + item.totalUsers, 0),
          monthlyData: sampleData,
        },
      });
    } else {
      sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'User growth data retrieved successfully',
        data: {
          year: targetYear,
          totalUsers,
          monthlyData,
        },
      });
    }
  } catch (error) {
    sendResponse(res, {
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      success: false,
      message: 'Error retrieving user growth data',
      error: (error as Error).message,
    });
  }
});

const getRecentUsers = catchAsync(async (req: Request, res: Response) => {
  try {
    const { limit = 10 } = req.query;
    
    const recentUsers = await User.find({ role: 'buyer' })
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .select('fullname email phone createdAt')
      .lean();

    const formattedUsers = recentUsers.map((user: any, index: number) => ({
      serialId: String(index + 1).padStart(2, '0'),
      fullname: user.fullname || 'N/A',
      email: user.email || 'N/A',
      phone: user.phone || 'N/A',
      joinedDate: user.createdAt ? user.createdAt.toISOString().split('T')[0] : 'Unknown'
    }));

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Recent users retrieved successfully',
      data: formattedUsers,
    });
  } catch (error) {
    sendResponse(res, {
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      success: false,
      message: 'Error retrieving recent users',
      error: (error as Error).message,
    });
  }
});

export const DashboardControllers = {
  getDashboardStats,
  getUserGrowth,
  getRecentUsers,
};