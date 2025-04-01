import React from 'react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import SubirBanners from '@/Layouts/Partials/Banners/SubirBanners';

interface SubirBannersPageProps {
  auth: {
    user: {
      username: string;
      email: string;
    };
  };
}

const SubirBannersPage = ({ auth }: SubirBannersPageProps) => {
  return (
    <DashboardLayout auth={auth}>
      <SubirBanners />
    </DashboardLayout>
  );
};

export default SubirBannersPage;