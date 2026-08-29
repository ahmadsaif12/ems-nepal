import { useEffect, useState } from "react";
import { Lock } from "lucide-react";
import toast from "react-hot-toast";

import Loading from "../components/Loading";
import ProfileForm from "../components/ProfileForm";
import ChangePasswordModal from "../components/ChangePasswordModal";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

const Settings = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const fetchProfile = async () => {
    try {
      const res = await api.get("/profile");
      const profile = res.data?.data || res.data;
      if (profile) setProfile(profile);
    } catch (error) {
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="w-full min-h-full animate-fade-in px-4 sm:px-6 lg:px-8 xl:px-10">
      {/* Header */}
      <div className="w-full pt-6 pb-2 mb-6">
        <h1 className="m-0 text-2xl font-semibold leading-8 text-slate-900">
          Settings
        </h1>
        <p className="m-0 mt-2 text-sm leading-5 text-slate-500">
          Manage your account and preferences
        </p>
      </div>

      {/* Profile */}
      {profile && (
        <div className="w-full mb-6">
          <ProfileForm initialData={profile} onSuccess={fetchProfile} />
        </div>
      )}

      {/* Password */}
      <div className="card w-full p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
          {/* Password information */}
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 shrink-0 rounded-xl bg-slate-100 flex items-center justify-center">
              <Lock className="w-5 h-5 text-slate-600" />
            </div>

            <div>
              <h3 className="m-0 text-base font-semibold leading-5 text-slate-900">
                Password
              </h3>
              <p className="m-0 mt-1 text-sm leading-5 text-slate-500">
                Update your account password
              </p>
            </div>
          </div>

          {/* Button */}
          <button
            type="button"
            onClick={() => setShowPasswordModal(true)}
            className="btn-secondary h-10 px-5 w-full sm:w-auto"
          >
            Change Password
          </button>
        </div>
      </div>

      {/* Modal */}
      <ChangePasswordModal
        open={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
      />
    </div>
  );
};

export default Settings;