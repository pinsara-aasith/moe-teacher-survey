import mongoose, { Document, Schema } from 'mongoose';

// Create enums for user role and vote type
enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER'
}

enum VoteType {
  UPVOTE = 'UPVOTE',
  DOWNVOTE = 'DOWNVOTE'
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
  password: string;
  name: string;
  surname: string;
  role: Role;
  refreshToken?: string;
  twoFactorToken?: string;
  votes: IVote[];
}

interface IPost extends Document {
  title: string;
  content: string;
  imageUrl: string;
  createdAt: Date;
  updatedAt: Date;
  upvotes: number;
  downvotes: number;
  votes: IVote[];
}

interface IVote extends Document {
  kind: VoteType;
  post: IPost;
  user: IUser;
  createdAt: Date;
  updatedAt: Date;
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
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  surname: { type: String, required: true },
  role: { type: String, enum: Object.values(Role), default: Role.USER },
  refreshToken: { type: String },
  twoFactorToken: { type: String },
  votes: [{ type: Schema.Types.ObjectId, ref: 'Vote' }]
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
  votes: [{ type: Schema.Types.ObjectId, ref: 'Vote' }]
});

// Vote Schema
const VoteSchema: Schema<IVote> = new Schema({
  kind: { type: String, enum: Object.values(VoteType), required: true },
  post: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Create models
const School = mongoose.models.School || mongoose.model<ISchool>('School', SchoolSchema);
const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
const Post = mongoose.models.Post || mongoose.model<IPost>('Post', PostSchema);
const Vote = mongoose.models.Vote || mongoose.model<IVote>('Vote', VoteSchema);


export { User, Post, Vote, School, Role, VoteType };
export type { IUser, IPost, IVote, ISchool };

