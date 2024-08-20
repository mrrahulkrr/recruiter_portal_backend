// server/controllers/jobController.js
const Job = require('../models/Jobs');
const User = require('../models/Users');

exports.getJobs = async (req, res) => {
  try {
    const jobs = await Job.find();
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createJob = async (req, res) => {
  const job = new Job(req.body);
  try {
    const newJob = await job.save();
    res.status(201).json(newJob);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateJob = async (req, res) => {
  try {
    const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedJob);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteJob = async (req, res) => {
  try {
    await Job.findByIdAndDelete(req.params.id);
    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// exports.applyForJob = async (req, res) => {
//   try {
//     const { jobId, userId } = req.body;
//     const job = await Job.findById(jobId);
//     const user = await User.findById(userId);

//     if (!job || !user) {
//       return res.status(404).json({ message: 'Job or User not found' });
//     }

//     if (job.applicants.includes(userId)) {
//       return res.status(400).json({ message: 'You have already applied for this job' });
//     }

//     job.applicants.push(userId);
//     user.appliedJobs.push(jobId);

//     await job.save();
//     await user.save();

//     res.status(200).json({ message: 'Successfully applied for the job' });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

exports.getApplicants = async (req, res) => {
  try {
    const { jobId } = req.params;
    const job = await Job.findById(jobId).populate('applicants', 'name email');
    
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.status(200).json(job.applicants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.applyForJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { name, email, resume } = req.body;
    console.log('Applying for job:', jobId);
    console.log('Application data:', { name, email, resume });

    const job = await Job.findById(jobId);
    if (!job) {
      console.log('Job not found:', jobId);
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if user with this email already exists
    let user = await User.findOne({ email });
    if (!user) {
      user = new User({ name, email, role: 'user' });
      await user.save();
      console.log('New user created:', user._id);
    } else {
      console.log('Existing user found:', user._id);
    }

    // Check if user has already applied
    if (job.applicants.includes(user._id)) {
      console.log('User already applied:', user._id);
      return res.status(400).json({ message: 'You have already applied for this job' });
    }

    job.applicants.push(user._id);
    await job.save();
    console.log('Application submitted successfully');

    res.status(201).json({ message: 'Application submitted successfully' });
  } catch (error) {
    console.error('Error in applyForJob:', error);
    res.status(500).json({ message: 'An error occurred while submitting the application', error: error.message });
  }
};

exports.getApplicants = async (req, res) => {
  try {
    const { jobId } = req.params;
    const job = await Job.findById(jobId).populate('applicants', 'name email');
    
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.status(200).json(job.applicants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};