import OnboardingRequest from './onboarding.model.js';

export const createRequest = async (req, res, next) => {
  try {
    const existing = await OnboardingRequest.findOne({ email: req.body.email, status: 'New' });
    if (existing) {
      const err = new Error('A request from this email is already waiting. We will contact you soon.');
      err.statusCode = 409;
      throw err;
    }
    await OnboardingRequest.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Request received',
      data: { received: true },
    });
  } catch (err) {
    next(err);
  }
};