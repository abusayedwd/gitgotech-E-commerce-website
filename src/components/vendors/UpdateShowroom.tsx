"use client";
import { useState, useEffect } from 'react';
import { Upload, X, Plus, MapPin } from 'lucide-react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useGetShowroomDetailsQuery, useResubmitShowroomMutation, useUpdateShowroomMutation } from '@/redux/features/vendor/showroomSlice/showroomSlice';
import url from './../../redux/api/baseUrl.js';
import toast from 'react-hot-toast';

const MapPicker = dynamic(() => import('./MapPicker'), { ssr: false });

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const toISO = (time: string) => {
  const [hours, minutes] = time.split(':');
  const date = new Date('2026-01-31');
  date.setUTCHours(Number(hours), Number(minutes), 0, 0);
  return date.toISOString();
};

const isoToTime = (iso: string) => iso?.slice(11, 16) ?? '00:00';
const isClosed = (iso: string) => iso?.slice(11, 19) === '00:00:00';

const getRemainingMs = (value?: string | null) => {
  if (!value) return 0;
  const target = new Date(value).getTime();
  return Number.isFinite(target) ? Math.max(0, target - Date.now()) : 0;
};

const formatCountdown = (milliseconds: number) => {
  const seconds = Math.max(0, Math.ceil(milliseconds / 1000));
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainder = seconds % 60;
  return [days ? `${days}d` : null, `${hours}h`, `${minutes}m`, `${remainder}s`]
    .filter(Boolean)
    .join(' ');
};

export default function UpdateShowroom() {
  const router = useRouter();
  const [id, setId] = useState('');
  const [showMap, setShowMap] = useState(false);
  const [ready, setReady] = useState(false);

  const { data: showroomDetails, refetch } = useGetShowroomDetailsQuery(id, {
    skip: !id,
    pollingInterval: 30_000,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });
  const [updateShowroom, { isLoading: isUpdating }] = useUpdateShowroomMutation();
  const [resubmitShowroom, { isLoading: isResubmitting }] = useResubmitShowroomMutation();

  const details = showroomDetails?.data;
  const applicationStatus =
    details?.application?.status || details?.approvalStatus || (details?.isApprove ? 'APPROVED' : 'SUBMITTED');
  const isRejected = applicationStatus === 'REJECTED';
  const isLoading = isUpdating || isResubmitting;

  const [logo, setLogo] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [nidImage, setNidImage] = useState<File | null>(null);
  const [ownerImage, setOwnerImage] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    showroom_name: '',
    showroom_address: '',
    referralCode: '',
  });

  const [categories, setCategories] = useState<string[]>(['']);
  const [location, setLocation] = useState({ lat: 0, lng: 0 });
  const [schedule, setSchedule] = useState(
    DAYS.map((day) => ({ day, open: '09:00', close: '18:00', isOpen: true }))
  );
  const [cooldownRemaining, setCooldownRemaining] = useState(0);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setId(params.get('id') || '');
  }, []);

  // Pre-fill form when details arrive
  useEffect(() => {
    if (!details || ready) return;

    setFormData({
      showroom_name: details.showroom_name ?? '',
      showroom_address: details.showroom_address ?? '',
      referralCode: details.referralCode ?? '',
    });

    setCategories(
      details.showroom_category?.length ? details.showroom_category : ['']
    );

    const coords = details.location?.coordinates;
    if (coords) {
      setLocation({ lat: coords[1], lng: coords[0] }); // GeoJSON [lng, lat]
    }

    if (details.showroom_schedule?.length) {
      setSchedule(
        details.showroom_schedule.map((s: any) => ({
          day: s.day,
          open: isoToTime(s.open),
          close: isoToTime(s.close),
          isOpen: s.isOpen ?? !isClosed(s.open),
        }))
      );
    }

    setLogoPreview(details.logo ? `${url}/${details.logo}` : null);
    setReady(true);
  }, [details]);

  useEffect(() => {
    if (!isRejected || details?.application?.canResubmit || !details?.application?.canResubmitAt) {
      setCooldownRemaining(0);
      return;
    }
    const cooldownAt = details.application.canResubmitAt;
    const update = () => setCooldownRemaining(getRemainingMs(cooldownAt));
    update();
    const interval = window.setInterval(update, 1000);
    return () => window.clearInterval(interval);
  }, [details?.application?.canResubmit, details?.application?.canResubmitAt, isRejected]);

  useEffect(() => {
    if (
      isRejected &&
      !details?.application?.canResubmit &&
      details?.application?.canResubmitAt &&
      cooldownRemaining === 0 &&
      getRemainingMs(details.application.canResubmitAt) === 0
    ) {
      void refetch();
    }
  }, [cooldownRemaining, details?.application?.canResubmit, details?.application?.canResubmitAt, isRejected, refetch]);

  useEffect(() => {
    if (ready && applicationStatus === 'SUBMITTED') {
      router.replace(`/v-profile/view-showroom?id=${id}`);
    }
  }, [applicationStatus, id, ready, router]);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogo(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleFileChange = (
    setter: React.Dispatch<React.SetStateAction<File | null>>,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) setter(file);
  };

  const handleCategoryChange = (index: number, value: string) => {
    setCategories((prev) => prev.map((c, i) => (i === index ? value : c)));
  };

  const addCategory = () => setCategories((prev) => [...prev, '']);
  const removeCategory = (index: number) =>
    setCategories((prev) => prev.filter((_, i) => i !== index));

  const handleScheduleChange = (
    index: number,
    field: 'open' | 'close' | 'isOpen',
    value: string | boolean
  ) => {
    setSchedule((prev) =>
      prev.map((s, i) => (i === index ? { ...s, [field]: value } : s))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isRejected && !details?.application?.canResubmit) {
      toast.error('Resubmission is not available yet');
      return;
    }

    const filteredCategories = categories.map((category) => category.trim()).filter(Boolean);
    if (filteredCategories.length === 0) {
      toast.error('Add at least one showroom category');
      return;
    }

    const fd = new FormData();

    if (logo) fd.append('logo', logo);
    if (nidImage) fd.append('nidImage', nidImage);
    if (ownerImage) fd.append('ownerImage', ownerImage);

    const locationPayload = {
      type: 'Point',
      coordinates: [location.lng, location.lat],
    };
    fd.append('location', JSON.stringify(locationPayload));

    const schedulePayload = schedule.map((s) => ({
      day: s.day,
      isOpen: s.isOpen,
      open: s.isOpen ? toISO(s.open) : toISO('00:00'),
      close: s.isOpen ? toISO(s.close) : toISO('00:00'),
    }));
    const textPayload = {
      showroom_name: formData.showroom_name.trim(),
      showroom_category: filteredCategories,
      showroom_address: formData.showroom_address.trim(),
      location: locationPayload,
      showroom_schedule: schedulePayload,
      referralCode: formData.referralCode.trim() || null,
    };

    if (isRejected) {
      fd.append('data', JSON.stringify(textPayload));
    } else {
      fd.append('showroom_name', textPayload.showroom_name);
      fd.append('showroom_address', textPayload.showroom_address);
      if (textPayload.referralCode) fd.append('referralCode', textPayload.referralCode);
      fd.append('showroom_category', JSON.stringify(textPayload.showroom_category));
      fd.append('location', JSON.stringify(textPayload.location));
      fd.append('showroom_schedule', JSON.stringify(textPayload.showroom_schedule));
    }

    try {
      const res = isRejected
        ? await resubmitShowroom({ data: fd, id }).unwrap()
        : await updateShowroom({ data: fd, id }).unwrap();
      if (res?.success) {
        toast.success(
          res?.message || (isRejected ? 'Showroom resubmitted successfully' : 'Showroom updated successfully'),
        );
        router.push(`/v-profile/view-showroom?id=${id}`);
      }
    } catch (error: any) {
      if (error?.status === 429) void refetch();
      const fallback = isRejected ? 'Failed to resubmit showroom' : 'Failed to update showroom';
      const msg = error?.data?.message || error?.data?.data || fallback;
      toast.error(typeof msg === 'string' ? msg : fallback);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-black via-[#0f0924] to-black light:from-white light:via-purple-50 light:to-white text-white light:text-gray-900 p-4 md:p-8">
      {/* Header */}
      <div className="max-w-4xl flex items-center gap-2 mx-auto mt-8 md:mt-20">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex items-center gap-2 cursor-pointer text-purple-400 hover:text-purple-300"
        >
          <div className="w-8 h-8 rounded-full bg-purple-600/40 flex items-center justify-center">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </div>
        </button>
        <h1 className="text-2xl font-semibold text-gray-300 light:text-gray-700 font-cormorant">
          {isRejected ? 'Fix & Resubmit Showroom' : 'Update Showroom'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto mt-6 space-y-8">
        {isRejected && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-5">
            <p className="font-semibold text-red-200 light:text-red-800">Changes required</p>
            <p className="mt-2 whitespace-pre-line text-sm text-red-100/75 light:text-red-700">
              {details?.application?.rejectionReason || 'Update the requested information and resubmit.'}
            </p>
            {!details?.application?.canResubmit && (
              <p className="mt-3 text-sm text-amber-200 light:text-amber-800">
                {cooldownRemaining > 0
                  ? `Resubmission available in ${formatCountdown(cooldownRemaining)}.`
                  : details?.application?.canResubmitAt
                    ? 'Cooldown finished. Checking resubmission availability…'
                    : 'Resubmission is currently unavailable.'}
              </p>
            )}
          </div>
        )}
        {/* Logo */}
        <div className="bg-gradient-to-br from-purple-900/30 via-gray-900/80 to-purple-900/20 light:from-purple-50 light:via-white light:to-purple-50 border border-purple-500/30 light:border-purple-200 rounded-2xl p-6 md:p-8 backdrop-blur-sm">
          <h2 className="text-lg font-semibold text-gray-300 light:text-gray-700 mb-4">Business Logo</h2>
          <div className="flex flex-col items-center">
            {logoPreview ? (
              <div className="relative">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-800 light:bg-gray-100 border-2 border-purple-500/50">
                  <img src={logoPreview} alt="Logo" className="w-full h-full object-cover" />
                </div>
                <button
                  type="button"
                  onClick={() => { setLogo(null); setLogoPreview(null); }}
                  className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-purple-500/50 rounded-full cursor-pointer bg-gray-900/50 light:bg-gray-100 hover:bg-gray-800/50 light:hover:bg-gray-200 transition">
                <Upload className="w-8 h-8 text-purple-400 mb-2" />
                <span className="text-xs text-gray-400 light:text-gray-500">Upload</span>
                <input type="file" accept="image/*" onChange={handleLogoChange} className="hidden" />
              </label>
            )}
            {logoPreview && (
              <label className="mt-3 flex items-center gap-2 text-sm text-purple-400 cursor-pointer hover:text-purple-300">
                <Upload className="w-4 h-4" /> Change Logo
                <input type="file" accept="image/*" onChange={handleLogoChange} className="hidden" />
              </label>
            )}
          </div>
        </div>

        {/* Information */}
        <div className="bg-gradient-to-br from-purple-900/30 via-gray-900/80 to-purple-900/20 light:from-purple-50 light:via-white light:to-purple-50 border border-purple-500/30 light:border-purple-200 rounded-2xl p-6 md:p-8 backdrop-blur-sm">
          <h2 className="text-lg font-semibold text-gray-300 light:text-gray-700 mb-6">Showroom Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-300 light:text-gray-600 text-sm font-medium mb-2">
                Showroom Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={formData.showroom_name}
                onChange={(e) => setFormData((p) => ({ ...p, showroom_name: e.target.value }))}
                placeholder="e.g., Premium Auto Gallery"
                required
                className="w-full bg-gray-800 light:bg-white border border-gray-700 light:border-gray-300 rounded-lg px-4 py-3 text-white light:text-gray-900 placeholder-gray-500 light:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-gray-300 light:text-gray-600 text-sm font-medium mb-2">Referral Code</label>
              <input
                type="text"
                value={formData.referralCode}
                onChange={(e) => setFormData((p) => ({ ...p, referralCode: e.target.value }))}
                placeholder="e.g., REF12444"
                className="w-full bg-gray-800 light:bg-white border border-gray-700 light:border-gray-300 rounded-lg px-4 py-3 text-white light:text-gray-900 placeholder-gray-500 light:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-gray-300 light:text-gray-600 text-sm font-medium mb-2">
                Showroom Address <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={formData.showroom_address}
                onChange={(e) => setFormData((p) => ({ ...p, showroom_address: e.target.value }))}
                placeholder="e.g., House 45, Road 12, Gulshan-1, Dhaka"
                required
                className="w-full bg-gray-800 light:bg-white border border-gray-700 light:border-gray-300 rounded-lg px-4 py-3 text-white light:text-gray-900 placeholder-gray-500 light:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="bg-gradient-to-br from-purple-900/30 via-gray-900/80 to-purple-900/20 light:from-purple-50 light:via-white light:to-purple-50 border border-purple-500/30 light:border-purple-200 rounded-2xl p-6 md:p-8 backdrop-blur-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-300 light:text-gray-700">Categories</h2>
            <button
              type="button"
              onClick={addCategory}
              className="flex items-center gap-1 text-sm text-purple-400 hover:text-purple-300"
            >
              <Plus className="w-4 h-4" /> Add
            </button>
          </div>
          <div className="space-y-3">
            {categories.map((cat, i) => (
              <div key={i} className="flex items-center gap-3">
                <input
                  type="text"
                  value={cat}
                  onChange={(e) => handleCategoryChange(i, e.target.value)}
                  placeholder="e.g., Luxury Cars"
                  className="flex-1 bg-gray-800 light:bg-white border border-gray-700 light:border-gray-300 rounded-lg px-4 py-2.5 text-white light:text-gray-900 placeholder-gray-500 light:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                {categories.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeCategory(i)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Location */}
        <div className="bg-gradient-to-br from-purple-900/30 via-gray-900/80 to-purple-900/20 light:from-purple-50 light:via-white light:to-purple-50 border border-purple-500/30 light:border-purple-200 rounded-2xl p-6 md:p-8 backdrop-blur-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-300 light:text-gray-700">Location</h2>
            <button
              type="button"
              onClick={() => setShowMap((v) => !v)}
              className="flex items-center gap-2 text-sm px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition"
            >
              <MapPin className="w-4 h-4" />
              {showMap ? 'Hide Map' : 'Pick on Map'}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-400 light:text-gray-500 text-sm mb-1">Latitude</label>
              <input
                type="number"
                step="any"
                value={location.lat || ''}
                onChange={(e) => setLocation((p) => ({ ...p, lat: parseFloat(e.target.value) || 0 }))}
                placeholder="e.g., 23.8103"
                className="w-full bg-gray-800 light:bg-white border border-gray-700 light:border-gray-300 rounded-lg px-4 py-2.5 text-white light:text-gray-900 placeholder-gray-500 light:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-gray-400 light:text-gray-500 text-sm mb-1">Longitude</label>
              <input
                type="number"
                step="any"
                value={location.lng || ''}
                onChange={(e) => setLocation((p) => ({ ...p, lng: parseFloat(e.target.value) || 0 }))}
                placeholder="e.g., 90.4125"
                className="w-full bg-gray-800 light:bg-white border border-gray-700 light:border-gray-300 rounded-lg px-4 py-2.5 text-white light:text-gray-900 placeholder-gray-500 light:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          {location.lat !== 0 && location.lng !== 0 && (
            <p className="text-xs text-purple-400 mb-3">
              Selected: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
            </p>
          )}

          {showMap && (
            <>
              <MapPicker
                lat={location.lat || 23.8103}
                lng={location.lng || 90.4125}
                onChange={(lat, lng) => setLocation({ lat, lng })}
              />
              <p className="text-xs text-gray-500 light:text-gray-400 mt-2">Click on map or search to set location</p>
            </>
          )}
        </div>

        {/* Documents */}
        <div className="bg-gradient-to-br from-purple-900/30 via-gray-900/80 to-purple-900/20 light:from-purple-50 light:via-white light:to-purple-50 border border-purple-500/30 light:border-purple-200 rounded-2xl p-6 md:p-8 backdrop-blur-sm">
          <h2 className="text-lg font-semibold text-gray-300 light:text-gray-700 mb-4">Documents (leave empty to keep existing)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FileInput label="NID Image" file={nidImage} onChange={(e) => handleFileChange(setNidImage, e)} />
            <FileInput label="Owner Image" file={ownerImage} onChange={(e) => handleFileChange(setOwnerImage, e)} />
          </div>
        </div>

        {/* Schedule */}
        <div className="bg-gradient-to-br from-purple-900/30 via-gray-900/80 to-purple-900/20 light:from-purple-50 light:via-white light:to-purple-50 border border-purple-500/30 light:border-purple-200 rounded-2xl p-6 md:p-8 backdrop-blur-sm">
          <h2 className="text-lg font-semibold text-gray-300 light:text-gray-700 mb-6">Operating Hours</h2>
          <div className="space-y-4">
            {schedule.map((s, i) => (
              <div key={s.day} className="flex items-center gap-3 flex-wrap">
                <span className="text-white light:text-gray-900 font-medium w-24 shrink-0">{s.day}</span>
                <label className="flex items-center gap-2 text-sm text-gray-400 light:text-gray-500 cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={s.isOpen}
                    onChange={(e) => handleScheduleChange(i, 'isOpen', e.target.checked)}
                    className="accent-purple-500 w-4 h-4"
                  />
                  Open
                </label>
                {s.isOpen ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="time"
                      value={s.open}
                      onChange={(e) => handleScheduleChange(i, 'open', e.target.value)}
                      className="bg-gray-800 light:bg-white border border-gray-700 light:border-gray-300 rounded-lg px-3 py-2 text-white light:text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                    />
                    <span className="text-gray-500 light:text-gray-400">—</span>
                    <input
                      type="time"
                      value={s.close}
                      onChange={(e) => handleScheduleChange(i, 'close', e.target.value)}
                      className="bg-gray-800 light:bg-white border border-gray-700 light:border-gray-300 rounded-lg px-3 py-2 text-white light:text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                    />
                  </div>
                ) : (
                  <span className="text-red-400 text-sm">Closed</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-center mt-8 pb-8">
          <button
            type="submit"
            disabled={isLoading || (isRejected && !details?.application?.canResubmit)}
            className="inline-flex items-center gap-2 px-8 py-3 bg-purple-600 hover:bg-purple-700 rounded-full text-white font-medium text-lg transition-all duration-300 transform hover:scale-[1.02] shadow-lg shadow-purple-500/20 disabled:opacity-50"
          >
            {isLoading
              ? (isRejected ? 'Resubmitting…' : 'Saving…')
              : (isRejected ? 'Resubmit Showroom' : 'Save Changes')}
          </button>
        </div>
      </form>
    </div>
  );
}

function FileInput({
  label,
  file,
  onChange,
}: {
  label: string;
  file: File | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div>
      <label className="block text-gray-300 light:text-gray-600 text-sm font-medium mb-2">{label}</label>
      <label className="flex items-center gap-3 cursor-pointer bg-gray-800 light:bg-white border border-gray-700 light:border-gray-300 rounded-lg px-4 py-3 hover:border-purple-500 transition">
        <Upload className="w-4 h-4 text-purple-400 shrink-0" />
        <span className="text-sm text-gray-400 light:text-gray-500 truncate">
          {file ? file.name : 'Choose file...'}
        </span>
        <input type="file" accept="image/*" onChange={onChange} className="hidden" />
      </label>
    </div>
  );
}
