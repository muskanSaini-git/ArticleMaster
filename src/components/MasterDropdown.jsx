import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaDownload, FaFileExcel } from 'react-icons/fa';
import * as XLSX from 'xlsx';
import './MasterDropdown.css';

const MasterDropdown = ({ userRole, type }) => {
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [newItem, setNewItem] = useState({ fullName: '', shortName: '', status: 'active' });
  const [loading, setLoading] = useState(false);

  // Define which dropdowns have linked relationships
  const linkedDropdowns = ['divisions', 'subdivisions', 'categories', 'descriptions', 'mcst'];
  
  // Check if current type is a linked dropdown
  const isLinkedDropdown = linkedDropdowns.includes(type);

  // Static data for different dropdown types
  const staticData = {
    segments: [
      { id: 1, fullName: 'Fashion & Apparel', shortName: 'Fashion', status: 'active' },
      { id: 2, fullName: 'Electronics & Technology', shortName: 'Electronics', status: 'active' },
      { id: 3, fullName: 'Home & Lifestyle', shortName: 'Home', status: 'active' },
      { id: 4, fullName: 'Sports & Fitness', shortName: 'Sports', status: 'active' },
      { id: 5, fullName: 'Beauty & Personal Care', shortName: 'Beauty', status: 'active' }
    ],
    divisions: [
      { id: 1, fullName: 'Men\'s Wear', shortName: 'Men', parentId: 1, status: 'active' },
      { id: 2, fullName: 'Women\'s Wear', shortName: 'Women', parentId: 1, status: 'active' },
      { id: 3, fullName: 'Kids Wear', shortName: 'Kids', parentId: 1, status: 'active' },
      { id: 4, fullName: 'Mobile Phones', shortName: 'Mobile', parentId: 2, status: 'active' },
      { id: 5, fullName: 'Computers & Laptops', shortName: 'Computers', parentId: 2, status: 'active' },
      { id: 6, fullName: 'Kitchen Appliances', shortName: 'Kitchen', parentId: 3, status: 'active' },
      { id: 7, fullName: 'Furniture', shortName: 'Furniture', parentId: 3, status: 'active' }
    ],
    subdivisions: [
      { id: 1, fullName: 'Shirts & T-Shirts', shortName: 'Shirts', parentId: 1, status: 'active' },
      { id: 2, fullName: 'Pants & Jeans', shortName: 'Pants', parentId: 1, status: 'active' },
      { id: 3, fullName: 'Dresses & Tops', shortName: 'Dresses', parentId: 2, status: 'active' },
      { id: 4, fullName: 'Skirts & Leggings', shortName: 'Skirts', parentId: 2, status: 'active' },
      { id: 5, fullName: 'Boys Clothing', shortName: 'Boys', parentId: 3, status: 'active' },
      { id: 6, fullName: 'Girls Clothing', shortName: 'Girls', parentId: 3, status: 'active' },
      { id: 7, fullName: 'Smartphones', shortName: 'Smartphones', parentId: 4, status: 'active' },
      { id: 8, fullName: 'Feature Phones', shortName: 'Feature', parentId: 4, status: 'active' }
    ],
    categories: [
      { id: 1, fullName: 'Casual Shirts', shortName: 'Casual', parentId: 1, status: 'active' },
      { id: 2, fullName: 'Formal Shirts', shortName: 'Formal', parentId: 1, status: 'active' },
      { id: 3, fullName: 'Denim Jeans', shortName: 'Denim', parentId: 2, status: 'active' },
      { id: 4, fullName: 'Cotton Pants', shortName: 'Cotton', parentId: 2, status: 'active' },
      { id: 5, fullName: 'Summer Dresses', shortName: 'Summer', parentId: 3, status: 'active' },
      { id: 6, fullName: 'Party Wear', shortName: 'Party', parentId: 3, status: 'active' }
    ],
    descriptions: [
      { id: 1, fullName: 'Cotton Casual Shirts', shortName: 'Cotton Casual', parentId: 1, status: 'active' },
      { id: 2, fullName: 'Linen Formal Shirts', shortName: 'Linen Formal', parentId: 2, status: 'active' },
      { id: 3, fullName: 'Blue Denim Jeans', shortName: 'Blue Denim', parentId: 3, status: 'active' },
      { id: 4, fullName: 'Khaki Cotton Pants', shortName: 'Khaki Cotton', parentId: 4, status: 'active' },
      { id: 5, fullName: 'Floral Summer Dresses', shortName: 'Floral Summer', parentId: 5, status: 'active' },
      { id: 6, fullName: 'Sequined Party Wear', shortName: 'Sequined Party', parentId: 6, status: 'active' }
    ],
    mcst: [
      { id: 1, fullName: 'Premium Cotton Casual Shirts', shortName: 'Premium Cotton', parentId: 1, status: 'active' },
      { id: 2, fullName: 'Executive Linen Formal Shirts', shortName: 'Executive Linen', parentId: 2, status: 'active' },
      { id: 3, fullName: 'Classic Blue Denim Jeans', shortName: 'Classic Blue', parentId: 3, status: 'active' },
      { id: 4, fullName: 'Comfort Khaki Cotton Pants', shortName: 'Comfort Khaki', parentId: 4, status: 'active' },
      { id: 5, fullName: 'Elegant Floral Summer Dresses', shortName: 'Elegant Floral', parentId: 5, status: 'active' },
      { id: 6, fullName: 'Glamorous Sequined Party Wear', shortName: 'Glamorous Sequined', parentId: 6, status: 'active' }
    ],
    vendors: [
      { id: 1, name: 'Fashion Supplier', description: 'Main fashion supplier', status: 'active' },
      { id: 2, name: 'Style Fashion', description: 'Style fashion vendor', status: 'active' },
      { id: 3, name: 'Leather Craft', description: 'Leather goods vendor', status: 'active' }
    ],
    seasons: [
      { id: 1, name: 'Summer', description: 'Summer season', status: 'active' },
      { id: 2, name: 'Winter', description: 'Winter season', status: 'active' },
      { id: 3, name: 'Spring', description: 'Spring season', status: 'active' },
      { id: 4, name: 'Autumn', description: 'Autumn season', status: 'active' }
    ],
    colors: [
      { id: 1, name: 'Red', description: 'Red color', status: 'active' },
      { id: 2, name: 'Blue', description: 'Blue color', status: 'active' },
      { id: 3, name: 'Green', description: 'Green color', status: 'active' },
      { id: 4, name: 'Black', description: 'Black color', status: 'active' },
      { id: 5, name: 'White', description: 'White color', status: 'active' }
    ],
    sizes: [
      { id: 1, name: 'XS', description: 'Extra Small', status: 'active' },
      { id: 2, name: 'S', description: 'Small', status: 'active' },
      { id: 3, name: 'M', description: 'Medium', status: 'active' },
      { id: 4, name: 'L', description: 'Large', status: 'active' },
      { id: 5, name: 'XL', description: 'Extra Large', status: 'active' },
      { id: 6, name: 'XXL', description: 'Double Extra Large', status: 'active' }
    ]
  };

  const typeLabels = {
    segments: 'Segments (FG_seg)',
    divisions: 'Divisions', 
    subdivisions: 'Sub Divisions',
    categories: 'Major Categories',
    descriptions: 'MC Descriptions (MC_Desc)',
    mcst: 'MCST Details',
    vendors: 'Vendors',
    seasons: 'Seasons',
    colors: 'Colors',
    sizes: 'Sizes'
  };

  // Parent dropdown options for linked dropdowns
  const parentOptions = {
    divisions: staticData.segments,
    subdivisions: staticData.divisions,
    categories: staticData.subdivisions,
    descriptions: staticData.categories,
    mcst: staticData.descriptions
  };

  // Get parent label based on current type
  const getParentLabel = (type) => {
    switch (type) {
      case 'divisions': return 'Segment';
      case 'subdivisions': return 'Division';
      case 'categories': return 'Sub Division';
      case 'descriptions': return 'Major Category';
      case 'mcst': return 'MC Description';
      default: return 'Parent';
    }
  };

  // Get parent dropdowns based on current type
  const getParentDropdowns = (type) => {
    switch (type) {
      case 'divisions':
        return [
          { key: 'segmentId', label: 'Segment', options: staticData.segments, required: true }
        ];
      case 'subdivisions':
        return [
          { key: 'segmentId', label: 'Segment', options: staticData.segments, required: true },
          { key: 'divisionId', label: 'Division', options: staticData.divisions, required: true }
        ];
      case 'categories':
        return [
          { key: 'segmentId', label: 'Segment', options: staticData.segments, required: true },
          { key: 'divisionId', label: 'Division', options: staticData.divisions, required: true },
          { key: 'subdivisionId', label: 'Sub Division', options: staticData.subdivisions, required: true }
        ];
      case 'descriptions':
        return [
          { key: 'segmentId', label: 'Segment', options: staticData.segments, required: true },
          { key: 'divisionId', label: 'Division', options: staticData.divisions, required: true },
          { key: 'subdivisionId', label: 'Sub Division', options: staticData.subdivisions, required: true },
          { key: 'categoryId', label: 'Major Category', options: staticData.categories, required: true }
        ];
      case 'mcst':
        return [
          { key: 'segmentId', label: 'Segment', options: staticData.segments, required: true },
          { key: 'divisionId', label: 'Division', options: staticData.divisions, required: true },
          { key: 'subdivisionId', label: 'Sub Division', options: staticData.subdivisions, required: true },
          { key: 'categoryId', label: 'Major Category', options: staticData.categories, required: true },
          { key: 'descriptionId', label: 'MC Description', options: staticData.descriptions, required: true }
        ];
      default:
        return [];
    }
  };

  // Get filtered options based on selected parents
  const getFilteredOptions = (dropdownKey, selectedParents) => {
    const options = getParentDropdowns(type).find(d => d.key === dropdownKey)?.options || [];
    
    if (dropdownKey === 'segmentId') {
      return options;
    }
    
    // Filter based on selected parents
    return options.filter(option => {
      switch (dropdownKey) {
        case 'divisionId':
          return option.parentId === selectedParents.segmentId;
        case 'subdivisionId':
          return option.parentId === selectedParents.divisionId;
        case 'categoryId':
          return option.parentId === selectedParents.subdivisionId;
        case 'descriptionId':
          return option.parentId === selectedParents.categoryId;
        default:
          return true;
      }
    });
  };

  // Initialize newItem with all parent fields
  const initializeNewItem = () => {
    const parentDropdowns = getParentDropdowns(type);
    const initialItem = { fullName: '', shortName: '', status: 'active' };
    
    parentDropdowns.forEach(dropdown => {
      initialItem[dropdown.key] = '';
    });
    
    return initialItem;
  };

  useEffect(() => {
    // Load static data for the specific type
    setItems(staticData[type] || []);
    setNewItem(initializeNewItem());
  }, [type]);

  const filteredItems = items.filter(item =>
    item.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.shortName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddNew = () => {
    setEditingItem(null);
    setNewItem(initializeNewItem());
    setModalOpen(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setNewItem({ ...item });
    setModalOpen(true);
  };

  const handleDelete = (itemId) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      setItems(items.filter(item => item.id !== itemId));
    }
  };

  const handleSave = () => {
    if (!newItem.fullName.trim()) {
      alert('Full Name is required!');
      return;
    }

    if (!newItem.shortName.trim()) {
      alert('Short Name is required!');
      return;
    }

    // Check if all required parent fields are selected
    const parentDropdowns = getParentDropdowns(type);
    const missingParents = parentDropdowns
      .filter(d => d.required)
      .filter(d => !newItem[d.key]);
    
    if (missingParents.length > 0) {
      alert(`Please select ${missingParents.map(d => d.label).join(', ')}`);
      return;
    }

    if (editingItem) {
      // Update existing item
      setItems(items.map(item => 
        item.id === editingItem.id ? { ...newItem, id: item.id } : item
      ));
    } else {
      // Add new item
      const newId = Math.max(...items.map(item => item.id), 0) + 1;
      setItems([...items, { ...newItem, id: newId }]);
    }

    setModalOpen(false);
    setNewItem(initializeNewItem());
    setEditingItem(null);
  };

  const handleCancel = () => {
    setModalOpen(false);
    setNewItem(initializeNewItem());
    setEditingItem(null);
  };

  const getParentNames = (item) => {
    const parentDropdowns = getParentDropdowns(type);
    const parentNames = [];
    
    parentDropdowns.forEach(dropdown => {
      const parentValue = item[dropdown.key];
      if (parentValue) {
        const parentItem = dropdown.options.find(opt => opt.id === parentValue);
        if (parentItem) {
          parentNames.push(parentItem.shortName);
        }
      }
    });
    
    return parentNames.join(' > ');
  };

  const handleParentChange = (dropdownKey, value) => {
    setNewItem(prev => {
      const updated = { ...prev, [dropdownKey]: value ? parseInt(value) : '' };
      
      // Clear dependent dropdowns when parent changes
      const parentDropdowns = getParentDropdowns(type);
      const currentIndex = parentDropdowns.findIndex(d => d.key === dropdownKey);
      
      for (let i = currentIndex + 1; i < parentDropdowns.length; i++) {
        updated[parentDropdowns[i].key] = '';
      }
      
      return updated;
    });
  };

  return (
    <div className="master-dropdown-container">
      <div className="master-dropdown">
        <div className="search-section">
          <input
            type="text"
            className="search-input"
            placeholder={`Search ${typeLabels[type]}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="add-icon" onClick={handleAddNew} title="Add New">
            +
          </button>
        </div>

        <table className="master-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Full Name</th>
              <th>Short Name</th>
              {isLinkedDropdown && <th>Parent</th>}
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map(item => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.fullName}</td>
                <td>{item.shortName}</td>
                {isLinkedDropdown && (
                  <td>{getParentNames(item)}</td>
                )}
                <td>
                  <span className={`status-badge ${item.status}`}>
                    {item.status}
                  </span>
                </td>
                <td>
                  <div className="action-icons">
                    <button 
                      className="action-icon edit-icon"
                      onClick={() => handleEdit(item)}
                      title="Edit"
                    >
                      <FaEdit />
                    </button>
                    <button 
                      className="action-icon delete-icon"
                      onClick={() => handleDelete(item.id)}
                      title="Delete"
                    >
                      <FaTrash className="delete-icon" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for Add/Edit */}
      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h2 className="modal-title">
                {editingItem ? 'Edit' : 'Add New'} {typeLabels[type]}
              </h2>
              <button className="modal-close" onClick={handleCancel}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  value={newItem.fullName}
                  onChange={(e) => setNewItem({ ...newItem, fullName: e.target.value })}
                  placeholder={`Enter ${typeLabels[type].slice(0, -1).toLowerCase()} full name`}
                />
              </div>
              
              <div className="form-group">
                <label>Short Name</label>
                <input
                  type="text"
                  value={newItem.shortName}
                  onChange={(e) => setNewItem({ ...newItem, shortName: e.target.value })}
                  placeholder={`Enter ${typeLabels[type].slice(0, -1).toLowerCase()} short name`}
                />
              </div>
              
              {isLinkedDropdown && (
                <>
                  {getParentDropdowns(type).map((dropdown, index) => (
                    <div key={dropdown.key} className="form-group">
                      <label>{dropdown.label}</label>
                      <select
                        value={newItem[dropdown.key] || ''}
                        onChange={(e) => handleParentChange(dropdown.key, e.target.value)}
                        disabled={index > 0 && !getParentDropdowns(type).slice(0, index).every(d => newItem[d.key])}
                      >
                        <option value="">Select {dropdown.label}</option>
                        {getFilteredOptions(dropdown.key, newItem).map(option => (
                          <option key={option.id} value={option.id}>
                            {option.shortName}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </>
              )}
              
              <div className="form-group">
                <label>Status</label>
                <select
                  value={newItem.status}
                  onChange={(e) => setNewItem({ ...newItem, status: e.target.value })}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button className="modal-btn cancel-btn" onClick={handleCancel}>
                Cancel
              </button>
              <button className="modal-btn save-btn" onClick={handleSave}>
                {editingItem ? 'Update' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MasterDropdown;
