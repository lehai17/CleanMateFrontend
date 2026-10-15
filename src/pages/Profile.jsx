import { useEffect, useState } from "react";
import {
  getProfileApi,
  registerCleanerApi,
  updateCleanerProfileApi,
  updateProfileApi,
} from "../api/auth";
import { useAuth } from "../context/AuthContext";

const defaultCleanerForm = {
  bio: "",
  city: "Ha Noi",
  addressText: "",
  hourlyRate: 120000,
};

export default function Profile() {
  const { user, refreshUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [cleanerSaving, setCleanerSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    address: "",
  });
  const [cleanerForm, setCleanerForm] = useState(defaultCleanerForm);

  useEffect(() => {
    getProfileApi()
      .then((profile) => {
        applyProfile(profile);
      })
      .finally(() => setLoading(false));
  }, []);

  const applyProfile = (profile) => {
    refreshUser(profile);
    setForm({
      fullName: profile.fullName || "",
      email: profile.email || "",
      phoneNumber: profile.phoneNumber || "",
      address: profile.address || "",
    });
    setCleanerForm({
      bio: profile.cleanerProfile?.bio || "",
      city: profile.cleanerProfile?.city || "Ha Noi",
      addressText:
        profile.cleanerProfile?.addressText || profile.address || "",
      hourlyRate: profile.cleanerProfile?.hourlyRate || 120000,
    });
  };

  const handleProfileSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      const updated = await updateProfileApi({
        fullName: form.fullName,
        phoneNumber: form.phoneNumber,
        address: form.address,
      });
      applyProfile(updated);
      setMessage("Da cap nhat thong tin khach hang.");
    } catch (error) {
      setMessage(error?.response?.data || "Cap nhat profile that bai.");
    } finally {
      setSaving(false);
    }
  };

  const handleCleanerSubmit = async (event) => {
    event.preventDefault();
    setCleanerSaving(true);
    setMessage("");
    try {
      const payload = {
        bio: cleanerForm.bio,
        city: cleanerForm.city,
        addressText: cleanerForm.addressText,
        hourlyRate: Number(cleanerForm.hourlyRate),
      };

      const updated = user?.isCleaner
        ? await updateCleanerProfileApi({
            fullName: form.fullName,
            phoneNumber: form.phoneNumber,
            addressText: cleanerForm.addressText,
            bio: cleanerForm.bio,
            city: cleanerForm.city,
            hourlyRate: Number(cleanerForm.hourlyRate),
          })
        : await registerCleanerApi(payload);

      applyProfile(updated);
      setMessage(
        user?.isCleaner
          ? "Da cap nhat ho so cleaner."
          : "Dang ky cleaner thanh cong. Ban co the vao khu vuc nhan viec."
      );
    } catch (error) {
      setMessage(error?.response?.data?.message || "Xu ly cleaner that bai.");
    } finally {
      setCleanerSaving(false);
    }
  };

  if (loading) {
    return <div className="max-w-5xl mx-auto px-4 py-10">Dang tai profile...</div>;
  }

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Ho so tai khoan</h1>
          <p className="mt-2 text-gray-600">
            Luu so dien thoai, dia chi mac dinh va dang ky them vai tro cleaner.
          </p>
          {message && (
            <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
              {message}
            </div>
          )}
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <section className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900">
              Thong tin khach hang
            </h2>
            <form className="mt-6 space-y-4" onSubmit={handleProfileSubmit}>
              <Field
                label="Ho va ten"
                value={form.fullName}
                onChange={(value) => setForm((current) => ({ ...current, fullName: value }))}
              />
              <Field label="Email" value={form.email} disabled />
              <Field
                label="So dien thoai"
                value={form.phoneNumber}
                onChange={(value) =>
                  setForm((current) => ({ ...current, phoneNumber: value }))
                }
              />
              <Field
                label="Dia chi mac dinh"
                value={form.address}
                onChange={(value) => setForm((current) => ({ ...current, address: value }))}
              />

              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
              >
                {saving ? "Dang luu..." : "Luu thong tin"}
              </button>
            </form>
          </section>

          <section className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {user?.isCleaner ? "Ho so cleaner" : "Dang ky lam cleaner"}
                </h2>
                <p className="mt-1 text-sm text-gray-600">
                  {user?.isCleaner
                    ? "Tai khoan nay da co khu vuc nhan viec rieng."
                    : "Sau khi dang ky, tai khoan se duoc chuyen sang khu vuc cleaner de nhan don."}
                </p>
              </div>
              {user?.isCleaner && (
                <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-800">
                  Cleaner active
                </span>
              )}
            </div>

            <form className="mt-6 space-y-4" onSubmit={handleCleanerSubmit}>
              <Field
                label="Thanh pho lam viec"
                value={cleanerForm.city}
                onChange={(value) => setCleanerForm((current) => ({ ...current, city: value }))}
              />
              <Field
                label="Dia chi nhan viec"
                value={cleanerForm.addressText}
                onChange={(value) =>
                  setCleanerForm((current) => ({ ...current, addressText: value }))
                }
              />
              <Field
                label="Muc gia / gio"
                type="number"
                value={String(cleanerForm.hourlyRate)}
                onChange={(value) =>
                  setCleanerForm((current) => ({ ...current, hourlyRate: value }))
                }
              />
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-gray-700">
                  Gioi thieu ban than
                </span>
                <textarea
                  rows="4"
                  value={cleanerForm.bio}
                  onChange={(event) =>
                    setCleanerForm((current) => ({ ...current, bio: event.target.value }))
                  }
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                />
              </label>

              <button
                type="submit"
                disabled={cleanerSaving}
                className="rounded-xl bg-amber-500 px-5 py-3 font-semibold text-white hover:bg-amber-600 disabled:opacity-60"
              >
                {cleanerSaving
                  ? "Dang xu ly..."
                  : user?.isCleaner
                  ? "Cap nhat ho so cleaner"
                  : "Dang ky lam cleaner"}
              </button>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, disabled = false, type = "text" }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-gray-700">{label}</span>
      <input
        type={type}
        value={value}
        disabled={disabled}
        onChange={onChange ? (event) => onChange(event.target.value) : undefined}
        className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 disabled:bg-gray-100"
      />
    </label>
  );
}
