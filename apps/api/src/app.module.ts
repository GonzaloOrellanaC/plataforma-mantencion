import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { PautasModule } from './pautas/pautas.module';
import { UploadsModule } from './uploads/uploads.module';
import { CompaniesModule } from './companies/companies.module';
import { RolesModule } from './roles/roles.module';
import { MachinesModule } from './machines/machines.module';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.COSMOS_MONGO_URI || 'mongodb://localhost:27017/sgm', {
      // options
    }),
    AuthModule,
    PautasModule,
    UploadsModule,
    CompaniesModule,
    RolesModule,
    MachinesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
