import { Request, Response } from 'express';
import User from '../user/user.model';
import { Booking } from '../bookings/booking.model';
import { Service } from '../services/service.model';
import httpStatus from 'http-status';
import { Types } from 'mongoose';

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
    meta?: any;
    error?: string;
  }
) => {
  res.status(data.statusCode).json({
    success: data.success,
    message: data.message || null,
    data: data.data || null,
    meta: data.meta || null,
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

const getConsultantTotalServices = catchAsync(async (req: Request, res: Response) => {
  try {
    const consultantId = req.user?.id;
    
    const totalServices = await Service.countDocuments({ 
      consultant_ids: consultantId 
    });

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Consultant total services retrieved successfully',
      data: { totalServices },
    });
  } catch (error) {
    sendResponse(res, {
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      success: false,
      message: 'Error retrieving consultant total services',
      error: (error as Error).message,
    });
  }
});

const getConsultantTotalClients = catchAsync(async (req: Request, res: Response) => {
  try {
    const consultantId = req.user?.id;
    
    const totalClients = await Booking.distinct('user', { 
      consultant: consultantId,
      payment_status: 'Paid'
    });

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Consultant total clients retrieved successfully',
      data: { totalClients: totalClients.length },
    });
  } catch (error) {
    sendResponse(res, {
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      success: false,
      message: 'Error retrieving consultant total clients',
      error: (error as Error).message,
    });
  }
});

const getConsultantTotalEarnings = catchAsync(async (req: Request, res: Response) => {
  try {
    const consultantId = req.user?.id;
    
    const totalEarnings = await Booking.aggregate([
      { 
        $match: { 
          consultant: new Types.ObjectId(consultantId),
          payment_status: 'Paid'
        } 
      },
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
          totalEarnings: { $sum: '$service.price' }
        }
      }
    ]);

    const earnings = totalEarnings.length > 0 ? totalEarnings[0].totalEarnings : 0;

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Consultant total earnings retrieved successfully',
      data: { totalEarnings: earnings },
    });
  } catch (error) {
    sendResponse(res, {
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      success: false,
      message: 'Error retrieving consultant total earnings',
      error: (error as Error).message,
    });
  }
});

const getConsultantServedClients = catchAsync(async (req: Request, res: Response) => {
  try {
    const consultantId = req.user?.id;
    const { page = 1, limit = 10 } = req.query;
    
    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;

    const total = await Booking.countDocuments({ 
      consultant: consultantId,
      payment_status: 'Paid'
    });
    
    const totalPage = Math.ceil(total / limitNumber);

    const clients = await Booking.find({ 
      consultant: consultantId,
      payment_status: 'Paid'
    })
      .populate('user', 'fullname email phone')
      .populate('service', 'title price')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNumber)
      .lean();

    const formattedClients = clients.map((booking: any, index: number) => ({
      serialId: String(index + 1).padStart(2, '0'),
      clientName: booking.user?.fullname || 'N/A',
      clientEmail: booking.user?.email || 'N/A',
      clientPhone: booking.user?.phone || 'N/A',
      serviceName: booking.service?.title || 'N/A',
      servicePrice: booking.service?.price || 0,
      bookingDate: booking.date ? booking.date.toISOString().split('T')[0] : 'Unknown',
      slotTime: booking.slot_time || 'N/A'
    }));

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Consultant served clients retrieved successfully',
      meta: {
        page: pageNumber,
        limit: limitNumber,
        total,
        totalPage
      },
      data: formattedClients,
    });
  } catch (error) {
    sendResponse(res, {
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      success: false,
      message: 'Error retrieving consultant served clients',
      error: (error as Error).message,
    });
  }
});

export const DashboardControllers = {
  getDashboardStats,
  getUserGrowth,
  getRecentUsers,
  getConsultantTotalServices,
  getConsultantTotalClients,
  getConsultantTotalEarnings,
  getConsultantServedClients,
};