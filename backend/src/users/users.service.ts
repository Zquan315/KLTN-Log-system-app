import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from './user.schema';

@Injectable()
export class UsersService implements OnModuleInit {
  constructor(@InjectModel(User.name) private model: Model<UserDocument>) {}

  async onModuleInit() {
    // bootstrap admin nếu chưa có
    const count = await this.model.countDocuments().exec();
    if (count === 0) {
      await this.createAdmin('admin', 'admin123'); // đổi sau
      console.log('Seeded default admin: admin/admin123');
    }
  }

  async createAdmin(username: string, password: string) {
    const hash = await bcrypt.hash(password, 10);
    return this.model.create({ username, passwordHash: hash, role: 'admin' });
  }

  async createReader(username: string, password: string) {
    const hash = await bcrypt.hash(password, 10);
    return this.model.create({ username, passwordHash: hash, role: 'read' });
  }

  async findByUsername(username: string) {
    return this.model.findOne({ username }).exec();
  }
}
