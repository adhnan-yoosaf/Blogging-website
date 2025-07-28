const Report = require('../models/reportModel')

exports.reportBlog = async (req, res) => {
    try {
        const { blog, reason } = req.body;

        await Report.create({
            sender: req.userId,
            blog,
            reason
        });

        res.status(201).json({
            success: true,
            message: 'Blog reported successfully',
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


exports.getAllReports = async (req, res) => {
    try {
        const reports = await Report.find()
            .populate('sender', 'fullName email')
            .populate('blog', 'title');

        res.status(200).json({
            success: true,
            reports
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


exports.resolveReport = async (req, res) => {
    try {
        const { id } = req.params;

        const report = await Report.findById(id).populate('sender', 'fullName')

        if (!report) {
            return res.status(404).json({
                success: false,
                message: 'Report not found'
            });
        }

        report.isResolved = true;
        await report.save();

        res.status(200).json({
            success: true,
            message: 'Report marked as resolved',
            report
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
