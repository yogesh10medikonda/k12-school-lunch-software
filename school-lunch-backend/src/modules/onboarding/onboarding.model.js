import mongoose from 'mongoose';

const onboardingRequestSchema = new mongoose.Schema(
  {
    schoolName: { type: String, required: true, trim: true, maxlength: 150 },
    country: { type: String, required: true, trim: true, maxlength: 100 },
    schoolType: { type: String, required: true, enum: ['Public', 'Private', 'Charter', 'Other'] },
    gradeRange: { type: String, required: true, enum: ['K-5', '6-8', '9-12', 'K-8', 'K-12'] },
    approxStudents: { type: Number, required: true, min: 1 },
    mealsPerDay: {
      type: String,
      required: true,
      enum: ['Lunch only', 'Breakfast and lunch', 'Breakfast, lunch and snacks'],
    },
    goals: { type: [String], default: [] },
    contactName: { type: String, required: true, trim: true, maxlength: 100 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 200 },
    phone: { type: String, trim: true, maxlength: 30 },
    consent: { type: Boolean, required: true },
    status: { type: String, enum: ['New', 'Contacted', 'Done'], default: 'New' },
  },
  { timestamps: true }
);

onboardingRequestSchema.index({ email: 1, status: 1 });

export default mongoose.model('OnboardingRequest', onboardingRequestSchema);