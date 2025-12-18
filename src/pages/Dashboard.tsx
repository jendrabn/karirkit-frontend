import { PageHeader } from "@/components/layouts/PageHeader";

const Dashboard = () => {
  return (
    <>
      <PageHeader
        title="Dashboard"
        subtitle="Selamat datang di dashboard KarirKit"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Dashboard content will be added here */}
        <div className="bg-card p-6 rounded-lg border">
          <h3 className="text-lg font-semibold mb-2">Total Lamaran</h3>
          <p className="text-3xl font-bold">0</p>
        </div>
        <div className="bg-card p-6 rounded-lg border">
          <h3 className="text-lg font-semibold mb-2">CV</h3>
          <p className="text-3xl font-bold">0</p>
        </div>
        <div className="bg-card p-6 rounded-lg border">
          <h3 className="text-lg font-semibold mb-2">Portfolio</h3>
          <p className="text-3xl font-bold">0</p>
        </div>
        <div className="bg-card p-6 rounded-lg border">
          <h3 className="text-lg font-semibold mb-2">Surat Lamaran</h3>
          <p className="text-3xl font-bold">0</p>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
