import mongoose, { Document, Schema } from 'mongoose';

// Create enums for user role and vote type
enum Role {
  ADMIN = 'system-admin',
  USER = 'school-admin'
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
  schoolCode: string;
  password: string;
  name: string;
  role: Role;
  refreshToken?: string;
  twoFactorToken?: string;
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
  email: { type: String, unique: true, required: false },
  schoolCode: { type: String, unique: true, required: false },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, enum: Object.values(Role), default: Role.USER },
  refreshToken: { type: String },
  twoFactorToken: { type: String },
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


// Create models
const School = mongoose.models.School || mongoose.model<ISchool>('School', SchoolSchema);
const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
const Post = mongoose.models.Post || mongoose.model<IPost>('Post', PostSchema);


export { User, Post, School, Role };
export type { IUser, IPost, ISchool };

