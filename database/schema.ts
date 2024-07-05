import mongoose, { Document, Model, Schema } from 'mongoose';

// Create enums for user role and vote type
enum Role {
  SYSTEM_ADMIN = 'system-admin',
  SCHOOL_ADMIN = 'school-admin'
}

interface ISchool {
  code: string;
  name: string;
  province: string;
  zone: string;
  division: string;
}

// Define TypeScript interfaces for your models
interface IUser extends Document {
  email: string;
  school: ISchool | string;
  password: string;
  name: string;
  role: Role;
  refreshToken?: string;
  // twoFactorToken?: string;
}

interface IPost extends Document {
  title: string;
  content: string;
  imageUrl: string;
  createdAt: Date;
  updatedAt: Date;
  upvotes: number;
  downvotes: number;
}

// Define TypeScript interfaces for your models
interface ITeacher extends Document {
  name: string;
  nic: string;
  gender: string;
  school: ISchool;
}

interface ISurveyRecord extends Document { }

const SchoolSchema: Schema<ISchool> = new Schema({
  code: { type: String, unique: true, required: true, trim: true },
  name: { type: String, required: true, trim: true },
  province: { type: String, required: true, trim: true },
  zone: { type: String, required: true, trim: true },
  division: { type: String, required: true, trim: true }
}, {
  timestamps: true
});

// User Schema
const UserSchema: Schema<IUser> = new Schema({
  email: { type: String, unique: true, required: false, index: true },
  school: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "School",
    unique: false, required: false, index: true
  },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, enum: Object.values(Role), default: Role.SCHOOL_ADMIN },
  refreshToken: { type: String, index: true },
  // twoFactorToken: { type: String },
});

// Post Schema
const PostSchema: Schema<IPost> = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  imageUrl: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  upvotes: { type: Number, default: 0 },
  downvotes: { type: Number, default: 0 },
});

// Post Schema
const TeacherSchema: Schema<ITeacher> = new Schema({
  name: { type: String },
  nic: { type: String },
  gender: { type: String },
  school:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "School",
    unique: false, required: false, index: true
  },
});

// Create models
const School: Model<ISchool> = mongoose.models.School || mongoose.model<ISchool>('School', SchoolSchema);
const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
const Teacher: Model<ITeacher> = mongoose.models.Teacher || mongoose.model<ITeacher>('Teacher', TeacherSchema);
const Post: Model<IPost> = mongoose.models.Post || mongoose.model<IPost>('Post', PostSchema);


export { User, Post, School, Role, Teacher };
export type { IUser, IPost, ISchool, ITeacher };

