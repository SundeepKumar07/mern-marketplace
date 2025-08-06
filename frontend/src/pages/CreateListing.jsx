import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function CreateListing() {
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [form, setForm] = useState({
    name: '',
    description: '',
    address: '',
    regularPrice: 0,
    discountPrice: 0,
    bathroom: 0,
    bedroom: 0,
    furnished: false,
    parking: false,
    type: '',
    offer: false,
    imageUrls: [],
  });
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const storeImage = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'profile-pic');

    const res = await fetch('https://api.cloudinary.com/v1_1/dwro2yaev/image/upload', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    if (!data.secure_url) throw new Error('Upload failed');
    return data.secure_url;
  };

  const handleImageUpload = async () => {
    if (files.length === 0) return toast.error('No images selected');
    setUploading(true);
    try {
      const uploadPromises = files.map((file) => storeImage(file));
      const imageUrls = await Promise.all(uploadPromises);
      setForm((prev) => ({
        ...prev,
        imageUrls: [...prev.imageUrls, ...imageUrls],
      }));
      setFiles([]);
      toast.success('Images uploaded successfully');
    } catch (err) {
      toast.error('Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.offer && Number(form.discountPrice) >= Number(form.regularPrice)) {
      toast.error('Discount must be less than regular price');
      return;
    }
    if (form.imageUrls.length === 0) {
      toast.error('Please upload at least one image');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BACKEND}/api/list/create-listing`, {
        method: 'POST',
        credentials: "include",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!data.success) toast.error(data.message || 'Failed to create listing');
      else {
        toast.success('Listing created successfully');
        setForm({
          name: '',
          description: '',
          address: '',
          regularPrice: 0,
          discountPrice: 0,
          bathroom: 0,
          bedroom: 0,
          furnished: false,
          parking: false,
          type: '',
          offer: false,
          imageUrls: [],
        });
        navigate(`/listing/${data.list._id}`);
      }
    } catch (err) {
      toast.error(err.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemovePreview = (fileToRemove) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file !== fileToRemove));
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-4xl space-y-6">
        <h1 className="text-3xl font-bold text-center text-blue-600">Create Listing</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            <input type="text" name="name" placeholder="Name" onChange={handleChange} value={form.name} className="px-4 py-2 border rounded-md" />
            <input type="text" name="description" placeholder="Description" onChange={handleChange} value={form.description} className="px-4 py-2 border rounded-md" />
            <input type="text" name="address" placeholder="Address" onChange={handleChange} value={form.address} className="px-4 py-2 border rounded-md" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
            {['sell', 'rent'].map((type) => (
              <label key={type} className="flex items-center gap-2">
                <input type="radio" name="type" value={type} onChange={handleChange} checked={form.type === type} className='w-5' />
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </label>
            ))}
            {['furnished', 'parking', 'offer'].map((opt) => (
              <label key={opt} className="flex items-center gap-2">
                <input type="checkbox" name={opt} onChange={handleChange} checked={form[opt]} />
                {opt.charAt(0).toUpperCase() + opt.slice(1)}
              </label>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              Regular Price
              <input type="number" name="regularPrice" onChange={handleChange} value={form.regularPrice} className="px-4 py-2 border rounded-md w-full" />
            </div>
            <div>
              Discount Price
              <input type="number" name="discountPrice" onChange={handleChange} value={form.discountPrice} className="px-4 py-2 border rounded-md w-full" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              Bathroom
              <input type="number" name="bathroom" min={1} onChange={handleChange} value={form.bathroom} className="px-4 py-2 border rounded-md w-full" />
            </div>
            <div>
              Bedroom
              <input type="number" name="bedroom" min={1} onChange={handleChange} value={form.bedroom} className="px-4 py-2 border rounded-md w-full" />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => {
                const selected = Array.from(e.target.files).filter((file) => file.type.startsWith('image/'));
                if (selected.length > 6) {
                  toast.error('Only 6 images allowed');
                  return;
                }
                setFiles(selected);
              }}
              className="border rounded-md px-4 py-2 w-full sm:w-auto"
            />
            <button
              type="button"
              onClick={handleImageUpload}
              disabled={uploading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition w-full sm:w-1/5"
            >
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
          </div>

          {files.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 mt-4">
              {files.map((file, i) => (
                <div key={i} className="relative">
                  <img src={URL.createObjectURL(file)} alt={`preview-${i}`} className="w-24 h-24 object-cover rounded-md" />
                  <button
                    type="button"
                    onClick={() => handleRemovePreview(file)}
                    className="absolute top-1 right-1 bg-red-600 text-white text-xs rounded-full px-2 py-0.5"
                  >
                    DELETE
                  </button>
                </div>
              ))}
            </div>
          )}

          {form.imageUrls.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 mt-4">
              {form.imageUrls.map((url, i) => (
                <img key={i} src={url} alt={`img-${i}`} className="w-24 h-24 object-cover rounded-md" />
              ))}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-md text-lg font-semibold transition"
          >
            {submitting ? 'Submitting...' : 'Submit Listing'}
          </button>
        </form>
      </div>
    </div>
  );
}