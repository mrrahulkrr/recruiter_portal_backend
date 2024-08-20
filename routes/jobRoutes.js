const express = require('express')
const { getJobs, createJob, updateJob, deleteJob, applyForJob, getApplicants } = require('../controllers/jobController');
const router = express.Router()


router.get('/', getJobs)
router.post('/', createJob)
router.put('/:id', updateJob)
router.delete('/:id', deleteJob)
router.post('/:jobId/apply', applyForJob);
router.get('/:jobId/applicants', getApplicants);

module.exports = router