import React, { useEffect, useState } from 'react';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [bills, setBills] = useState([]);
  const [products, setProducts] = useState([]);
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [globalProducts, setGlobalProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [customPrice, setCustomPrice] = useState('');
  const [addError, setAddError] = useState('');
  const [addLoading, setAddLoading] = useState(false);
  const [editProductId, setEditProductId] = useState(null);
  const [editPrice, setEditPrice] = useState('');
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState('');
  const [deleteProductId, setDeleteProductId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (!userData) {
      window.location.href = '/login';
      return;
    }
   // setUser(userData);
    fetchDashboardData(userData);
  }, []);

  const fetchDashboardData = async (userData) => {
    setLoading(true);
    setError('');
    try {

      const userRes = await fetch(`https://autobill-3rd-server-for-crud-opertions.onrender.com/user/${userData.user_id}`);
      const userD = await userRes.json();
      setUser(userD);



      // Fetch bills
      const billsRes = await fetch(`https://autobill-3rd-server-for-crud-opertions.onrender.com/user-bills/${userData.user_id}`);
      const billsData = await billsRes.json();
      setBills(billsData);
      // Fetch products
      const productsRes = await fetch(`https://autobill-3rd-server-for-crud-opertions.onrender.com/user-products/${userData.user_id}`);
      const productsData = await productsRes.json();

      const normalizedProductsData = Array.isArray(productsData) ? productsData : (productsData && productsData[0] ? productsData[0] : []);
      setProducts(normalizedProductsData);

      // Fetch subscription
      const subRes = await fetch(`https://autobill-3rd-server-for-crud-opertions.onrender.com/subscription/${userData.user_id}`);
      const subData = await subRes.json();
      setSubscription(subData);
    } catch (err) {
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const openAddProductModal = async () => {
    setShowAddModal(true);
    setAddError('');
    setAddLoading(false);
    setSelectedProductId('');
    setCustomPrice('');
    // Fetch global products
    try {
      const res = await fetch('https://autobill-3rd-server-for-crud-opertions.onrender.com/get-products');
      const data = await res.json();
      setGlobalProducts(Array.isArray(data) ? data : data[0]);
    } catch (err) {
      setAddError('Failed to load products');
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!selectedProductId || !customPrice) {
      setAddError('Please select a product and enter a price.');
      return;
    }
    setAddLoading(true);
    setAddError('');
    try {
      const res = await fetch(`https://autobill-3rd-server-for-crud-opertions.onrender.com/user-products/${user.user_id}/${selectedProductId}?price=${encodeURIComponent(customPrice)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) {
        let errMsg = 'Failed to add product';
        try {
          const errData = await res.json();
          if (errData && errData.detail) errMsg = errData.detail;
        } catch {}
        throw new Error(errMsg);
      }
      setShowAddModal(false);
      fetchDashboardData(user);
    } catch (err) {
      setAddError('Failed to add product');
    } finally {
      setAddLoading(false);
    }
  };

  const handleUpdateProduct = (productId, currentPrice) => {
    setEditProductId(productId);
    setEditPrice(currentPrice);
    setEditError('');
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    setEditError('');
    try {
      const res = await fetch(`https://autobill-3rd-server-for-crud-opertions.onrender.com/user-products/${user.user_id}/${editProductId}?price=${encodeURIComponent(editPrice)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) {
        let errMsg = 'Failed to update price';
        try {
          const errData = await res.json();
          if (errData && errData.detail) errMsg = errData.detail;
        } catch {}
        throw new Error(errMsg);
      }
      setEditProductId(null);
      fetchDashboardData(user);
    } catch (err) {
      setEditError(err.message);
    } finally {
      setEditLoading(false);
    }
  };

  const handleDeleteProduct = (productId) => {
    setDeleteProductId(productId);
    setDeleteError('');
  };

  const confirmDeleteProduct = async () => {
    setDeleteLoading(true);
    setDeleteError('');
    try {
      const res = await fetch(`https://autobill-3rd-server-for-crud-opertions.onrender.com/user-products/${user.user_id}/${deleteProductId}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        let errMsg = 'Failed to delete product';
        try {
          const errData = await res.json();
          if (errData && errData.detail) errMsg = errData.detail;
        } catch {}
        throw new Error(errMsg);
      }
      setDeleteProductId(null);
      fetchDashboardData(user);
    } catch (err) {
      setDeleteError(err.message);
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading dashboard...</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Welcome, {user?.name || 'User'}</h1>

      {/* --- User Information Section --- */}
      <section className="mb-8 p-6 bg-white shadow-lg rounded-lg border border-gray-200">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Your Account Details</h2>
        {user ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6 text-gray-700">
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-500">Name:</span>
              <span className="text-lg font-semibold">{user.name}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-500">Email:</span>
              <span className="text-lg">{user.email} {user.email_verified ? <span className="text-green-600">(Verified)</span> : <span className="text-red-600">(Not Verified)</span>}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-500">Shop Name:</span>
              <span className="text-lg">{user.shop_name || 'N/A'}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-500">Phone:</span>
              <span className="text-lg">{user.phone || 'N/A'}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-500">Account Status:</span>
              <span className="text-lg capitalize">{user.status}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-500">Joined:</span>
              <span className="text-lg">{new Date(user.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-500">Last Updated:</span>
              <span className="text-lg">{new Date(user.updated_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
            {user.telegram_user_id && (
                <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-500">Telegram User ID:</span>
                    <span className="text-lg">{user.telegram_user_id}</span>
                </div>
            )}
          </div>
        ) : (
          <p className="text-gray-600">User details not available.</p>
        )}
      </section>
      {/* --- End User Information Section --- */}

      {/* Subscription Section */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Your Subscription</h2>
        {subscription ? (
          <div className="bg-blue-50 p-4 rounded shadow mb-2">
            <div>Plan: <b>{subscription.plan_id}</b></div>
            <div>Status: <b>{subscription.status}</b></div>
            <div>Expires: <b>{subscription.end_date}</b></div>
            <div>Auto Renew: <b>{subscription.auto_renew ? 'Yes' : 'No'}</b></div>
          </div>
        ) : <div>No active subscription found.</div>}
      </section>
      {/* Bills Section */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Your Bills</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded shadow">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Bill ID</th>
                <th className="py-2 px-4 border-b">Total Amount</th>
                <th className="py-2 px-4 border-b">Created At</th>
              </tr>
            </thead>
            <tbody>
              {bills.map(bill => (
                <tr key={bill.bill_id}>
                  <td className="py-2 px-4 border-b">{bill.bill_id}</td>
                  <td className="py-2 px-4 border-b">₹{bill.total_amount}</td>
                  <td className="py-2 px-4 border-b">{bill.created_at}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      {/* Products Section */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Your Products</h2>
        <button onClick={openAddProductModal} className="mb-4 bg-green-600 text-white px-4 py-2 rounded">Add Product</button>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded shadow">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Product ID</th>
                <th className="py-2 px-4 border-b">Image</th> {/* New column for image */}
                <th className="py-2 px-4 border-b">Title</th>
                <th className="py-2 px-4 border-b">Price</th>
                <th className="py-2 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.product_id}>
                  <td className="py-2 px-4 border-b">{product.product_id}</td>
                  <td className="py-2 px-4 border-b">
                    {/* Display product image, use a placeholder if not available */}
                    <img
                      src={product.image || 'https://via.placeholder.com/75'}
                      alt={product.title || 'Product Image'}
                      className="w-16 h-16 object-cover rounded"
                    />
                  </td>
                  <td className="py-2 px-4 border-b">{product.title}</td>
                  <td className="py-2 px-4 border-b">₹{product.price}</td>
                  <td className="py-2 px-4 border-b">
                    <button onClick={() => handleUpdateProduct(product.product_id, product.price)} className="mr-2 bg-yellow-500 text-white px-2 py-1 rounded">Edit</button>
                    <button onClick={() => handleDeleteProduct(product.product_id)} className="bg-red-600 text-white px-2 py-1 rounded">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md relative">
            <button onClick={() => setShowAddModal(false)} className="absolute top-2 right-2 text-gray-500 hover:text-gray-800">&times;</button>
            <h3 className="text-xl font-bold mb-4">Add Product</h3>
            <form onSubmit={handleAddProduct}>
              <div className="mb-4">
                <label className="block mb-1 font-medium">Select Product</label>
                <div className="grid grid-cols-2 gap-4 max-h-64 overflow-y-auto mb-2">
                  {globalProducts.map(product => (
                    <div
                      key={product.id}
                      className={`border rounded p-2 flex flex-col items-center cursor-pointer transition ${selectedProductId === String(product.id) ? 'border-blue-600 ring-2 ring-blue-400' : 'border-gray-300'}`}
                      onClick={() => setSelectedProductId(String(product.id))}
                    >
                      <img src={product.image} alt={product.title} className="w-20 h-20 object-cover rounded mb-2" />
                      <div className="font-semibold text-center text-sm mb-1">{product.title}</div>
                      <div className="text-xs text-gray-600">Global Price: ₹{product.price}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mb-4">
                <label className="block mb-1 font-medium">Custom Price (₹)</label>
                <input type="number" min="0" step="0.01" value={customPrice} onChange={e => setCustomPrice(e.target.value)} className="w-full border px-3 py-2 rounded" required disabled={!selectedProductId} />
              </div>
              {addError && <div className="bg-red-100 text-red-700 p-2 rounded mb-2">{addError}</div>}
              <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition" disabled={addLoading || !selectedProductId}>
                {addLoading ? 'Adding...' : 'Add Product'}
              </button>
            </form>
          </div>
        </div>
      )}
      {/* Edit Product Modal */}
      {editProductId && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md relative">
            <button onClick={() => setEditProductId(null)} className="absolute top-2 right-2 text-gray-500 hover:text-gray-800">&times;</button>
            <h3 className="text-xl font-bold mb-4">Edit Product Price</h3>
            <form onSubmit={handleEditSubmit}>
              <div className="mb-4">
                <label className="block mb-1 font-medium">New Price (₹)</label>
                <input type="number" min="0" step="0.01" value={editPrice} onChange={e => setEditPrice(e.target.value)} className="w-full border px-3 py-2 rounded" required />
              </div>
              {editError && <div className="bg-red-100 text-red-700 p-2 rounded mb-2">{editError}</div>}
              <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition" disabled={editLoading}>
                {editLoading ? 'Updating...' : 'Update Price'}
              </button>
            </form>
          </div>
        </div>
      )}
      {/* Delete Product Modal */}
      {deleteProductId && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md relative">
            <button onClick={() => setDeleteProductId(null)} className="absolute top-2 right-2 text-gray-500 hover:text-gray-800">&times;</button>
            <h3 className="text-xl font-bold mb-4">Delete Product</h3>
            <p className="mb-4">Are you sure you want to delete this product from your shop?</p>
            {deleteError && <div className="bg-red-100 text-red-700 p-2 rounded mb-2">{deleteError}</div>}
            <div className="flex gap-4">
              <button onClick={confirmDeleteProduct} className="bg-red-600 text-white px-4 py-2 rounded" disabled={deleteLoading}>
                {deleteLoading ? 'Deleting...' : 'Delete'}
              </button>
              <button onClick={() => setDeleteProductId(null)} className="bg-gray-300 text-gray-800 px-4 py-2 rounded">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;