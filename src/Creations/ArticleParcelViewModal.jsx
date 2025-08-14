import React, { useState, useEffect, useRef } from "react";
import './ArticleParcelViewModal.css';
import { FaUser, FaBarcode, FaCalendarAlt, FaBoxOpen, FaInfoCircle, FaTrash, FaEdit, FaUpload, FaTimes, FaDownload, FaEye, FaCheck, FaTimes as FaTimesIcon } from 'react-icons/fa';
import { MdOutlineImage } from "react-icons/md";
import * as XLSX from "xlsx";
import config from '../config';
// import hybridClient from '../api/hybridClient';

// Simple backend error logger - only shows backend errors
const logBackendError = (message, error) => {
  if (error && (error.status || error.statusText || error.message)) {
    console.error(`🔴 BACKEND ERROR: ${message}`, {
      status: error.status,
      statusText: error.statusText,
      message: error.message,
      data: error.data || error.response
    });
  }
};

/*
 * Dynamic Dropdown API Support:
 * - GetDynamicDropdownData?field=MACRO_MVGR - Fetches dropdown data for specific fields
 * - Supports any field parameter for flexible dropdown data fetching
 * - Automatically caches results to avoid repeated API calls
 * - Provides fallback data if API fails
 */

// Handle ArticleFiles URLs that return 404 - convert to placeholder
const handleArticleFilesUrl = (imageUrl) => {
  if (!imageUrl || typeof imageUrl !== 'string') {
    return imageUrl;
  }
  
  // Fix incorrect base URLs from backend
  if (imageUrl.includes('192.168.151.24:9000')) {
    const fixedUrl = imageUrl.replace('192.168.151.24:9000', '192.168.149.75');

    return fixedUrl;
  }
  
  // Return a placeholder image for ArticleFiles URLs
  if (imageUrl.includes('/ArticleFiles/')) {
    // Return a placeholder image URL
    return 'https://via.placeholder.com/150x150?text=Image+Not+Found';
  }
  
  return imageUrl;
};

const ArticleParcelViewModal = ({
  open,
  onClose,
  rowData,
  excelMode,
  columnDefinitions = [],
  onSave,
  readOnly = false,
  rowsData,
  isEdit,
  userRole
}) => {

  // DUMMY DATA FOR DEMO - Comment out backend APIs
  const dummySegments = [
    { id: 1, value: 'APPAREL', label: 'APPAREL', fG_SegId: 1, fG_SegName: 'APPAREL' },
    { id: 2, value: 'FOOTWEAR', label: 'FOOTWEAR', fG_SegId: 2, fG_SegName: 'FOOTWEAR' },
    { id: 3, value: 'ACCESSORIES', label: 'ACCESSORIES', fG_SegId: 3, fG_SegName: 'ACCESSORIES' },
    { id: 4, value: 'BAGS', label: 'BAGS', fG_SegId: 4, fG_SegName: 'BAGS' },
    { id: 5, value: 'JEWELRY', label: 'JEWELRY', fG_SegId: 5, fG_SegName: 'JEWELRY' }
  ];

  const dummyDivisions = [
    { id: 1, value: 'KIDS', label: 'KIDS', fG_DivId: 1, fG_DivName: 'KIDS' },
    { id: 2, value: 'MEN', label: 'MEN', fG_DivId: 2, fG_DivName: 'MEN' },
    { id: 3, value: 'WOMEN', label: 'WOMEN', fG_DivId: 3, fG_DivName: 'WOMEN' },
    { id: 4, value: 'UNISEX', label: 'UNISEX', fG_DivId: 4, fG_DivName: 'UNISEX' },
    { id: 5, value: 'INFANT', label: 'INFANT', fG_DivId: 5, fG_DivName: 'INFANT' }
  ];

  const dummySubDivisions = [
    { id: 1, value: 'KB-SETS', label: 'KB-SETS', subDivId: 1, subDivName: 'KB-SETS' },
    { id: 2, value: 'MB-SHIRTS', label: 'MB-SHIRTS', subDivId: 2, subDivName: 'MB-SHIRTS' },
    { id: 3, value: 'WB-DRESSES', label: 'WB-DRESSES', subDivId: 3, subDivName: 'WB-DRESSES' },
    { id: 4, value: 'KB-TOPS', label: 'KB-TOPS', subDivId: 4, subDivName: 'KB-TOPS' },
    { id: 5, value: 'MB-PANTS', label: 'MB-PANTS', subDivId: 5, subDivName: 'MB-PANTS' },
    { id: 6, value: 'WB-TOPS', label: 'WB-TOPS', subDivId: 6, subDivName: 'WB-TOPS' }
  ];

  const dummyMajorCategories = [
    { id: 1, value: 'IB_B_SUIT_FS', label: 'IB_B_SUIT_FS', majorCatId: 1, majorCategoryName: 'IB_B_SUIT_FS' },
    { id: 2, value: 'IB_B_SHIRT_FS', label: 'IB_B_SHIRT_FS', majorCatId: 2, majorCategoryName: 'IB_B_SHIRT_FS' },
    { id: 3, value: 'IB_B_DRESS_FS', label: 'IB_B_DRESS_FS', majorCatId: 3, majorCategoryName: 'IB_B_DRESS_FS' },
    { id: 4, value: 'IB_B_JEANS_FS', label: 'IB_B_JEANS_FS', majorCatId: 4, majorCategoryName: 'IB_B_JEANS_FS' },
    { id: 5, value: 'IB_B_SHOES_FS', label: 'IB_B_SHOES_FS', majorCatId: 5, majorCategoryName: 'IB_B_SHOES_FS' }
  ];

  const dummyMcCodes = [
    { id: 1, value: '113030110', label: '113030110', mcCodeId: 1, mc_Code: '113030110' },
    { id: 2, value: '113030120', label: '113030120', mcCodeId: 2, mc_Code: '113030120' },
    { id: 3, value: '113030130', label: '113030130', mcCodeId: 3, mc_Code: '113030130' },
    { id: 4, value: '113030140', label: '113030140', mcCodeId: 4, mc_Code: '113030140' },
    { id: 5, value: '113030150', label: '113030150', mcCodeId: 5, mc_Code: '113030150' }
  ];

  const dummyMcDescriptions = [
    { id: 1, value: 'M_TEES_HS', label: 'M_TEES_HS', mcId: 1, mC_DESC: 'M_TEES_HS' },
    { id: 2, value: 'M_SHIRTS_HS', label: 'M_SHIRTS_HS', mcId: 2, mC_DESC: 'M_SHIRTS_HS' },
    { id: 3, value: 'M_DRESSES_HS', label: 'M_DRESSES_HS', mcId: 3, mC_DESC: 'M_DRESSES_HS' },
    { id: 4, value: 'M_JEANS_HS', label: 'M_JEANS_HS', mcId: 4, mC_DESC: 'M_JEANS_HS' },
    { id: 5, value: 'M_SHOES_HS', label: 'M_SHOES_HS', mcId: 5, mC_DESC: 'M_SHOES_HS' }
  ];

  // Add dummy data for MC_ST field
  const dummyMcstDetails = [
    { id: 1, value: 'MCST001', label: 'MCST001', mcstId: 1, mcstName: 'MCST001' },
    { id: 2, value: 'MCST002', label: 'MCST002', mcstId: 2, mcstName: 'MCST002' },
    { id: 3, value: 'MCST003', label: 'MCST003', mcstId: 3, mcstName: 'MCST003' },
    { id: 4, value: 'MCST004', label: 'MCST004', mcstId: 4, mcstName: 'MCST004' },
    { id: 5, value: 'MCST005', label: 'MCST005', mcstId: 5, mcstName: 'MCST005' }
  ];

  const dummyDynamicDropdowns = {
    'MACRO_MVGR': [
      { id: 1, value: 'Macro1', label: 'Macro1' },
      { id: 2, value: 'Macro2', label: 'Macro2' },
      { id: 3, value: 'Macro3', label: 'Macro3' },
      { id: 4, value: 'Macro4', label: 'Macro4' },
      { id: 5, value: 'Macro5', label: 'Macro5' }
    ],
    'MICRO_MVGR': [
      { id: 1, value: 'Micro1', label: 'Micro1' },
      { id: 2, value: 'Micro2', label: 'Micro2' },
      { id: 3, value: 'Micro3', label: 'Micro3' },
      { id: 4, value: 'Micro4', label: 'Micro4' },
      { id: 5, value: 'Micro5', label: 'Micro5' }
    ],
    'FAB_DIV': [
      { id: 1, value: 'Fabric1', label: 'Fabric1' },
      { id: 2, value: 'Fabric2', label: 'Fabric2' },
      { id: 3, value: 'Fabric3', label: 'Fabric3' },
      { id: 4, value: 'Fabric4', label: 'Fabric4' },
      { id: 5, value: 'Fabric5', label: 'Fabric5' }
    ],
    'YARN_01': [
      { id: 1, value: 'Yarn1', label: 'Yarn1' },
      { id: 2, value: 'Yarn2', label: 'Yarn2' },
      { id: 3, value: 'Yarn3', label: 'Yarn3' },
      { id: 4, value: 'Yarn4', label: 'Yarn4' },
      { id: 5, value: 'Yarn5', label: 'Yarn5' }
    ],
    'YARN_02': [
      { id: 1, value: 'YarnA', label: 'YarnA' },
      { id: 2, value: 'YarnB', label: 'YarnB' },
      { id: 3, value: 'YarnC', label: 'YarnC' },
      { id: 4, value: 'YarnD', label: 'YarnD' },
      { id: 5, value: 'YarnE', label: 'YarnE' }
    ]
  };

  // All hooks at the top level
  const [showAll, setShowAll] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [showAddRowPopup, setShowAddRowPopup] = useState(false);

  // Ensure column definitions are available - create fallback if needed
  const safeColumnDefinitions = columnDefinitions && columnDefinitions.length > 0 ? columnDefinitions : [
    { name: "ART_CR_DATE", type: "date" },
    { name: "FG_SEG", type: "dropdown" },
    { name: "FG_DIV", type: "dropdown" },
    { name: "SUB_DIV", type: "dropdown" },
    { name: "MJ_CAT", type: "dropdown" },
    { name: "MC_DESC", type: "dropdown" },
    { name: "MC_ST", type: "dropdown" },
    { name: "MC_CD", type: "text" },
    { name: "GEN_ART", type: "text" },
    { name: "HSN_CODE", type: "text" },
    { name: "VND_CD", type: "text" },
    { name: "VND_NM", type: "text" },
    { name: "VND_DZN_NO", type: "text" },
    { name: "MRP", type: "number" },
    { name: "NOA", type: "number" },
    { name: "STATUS", type: "text" },
    { name: "CREATED_BY", type: "text" },
    { name: "Images", type: "images" }
  ];

  // Dropdown data state variables
  const [segments, setSegments] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [subDivisions, setSubDivisions] = useState([]);
  const [majorCategories, setMajorCategories] = useState([]);
  const [mcCodes, setMcCodes] = useState([]);
  const [mcDescriptions, setMcDescriptions] = useState([]);
  const [mcstDetails, setMcstDetails] = useState([]);
  const [loadingDropdowns, setLoadingDropdowns] = useState(false);
  const [dynamicDropdowns, setDynamicDropdowns] = useState({});
  const [dynamicDropdownsLoading, setDynamicDropdownsLoading] = useState(true); // Track dynamic dropdowns loading state
  const [mandatoryFields, setMandatoryFields] = useState([]); // Dynamic mandatory fields from selected FG_SEG


  // Initialize with dummy data for demo
  const [rows, setRows] = useState([
    {
      ART_CR_DATE: new Date().toISOString().split('T')[0],
      FG_SEG: 'APPAREL',
      FG_DIV: 'KIDS',
      SUB_DIV: 'KB-SETS',
      MJ_CAT: 'IB_B_SUIT_FS',
      MC_CD: '113030110',
      MC_DESC: 'M_TEES_HS',
      MC_ST: 'MCST001',
      MACRO_MVGR: 'Macro1',
      MICRO_MVGR: 'Micro1',
      FAB_DIV: 'Fabric1',
      YARN_01: 'Yarn1',
      YARN_02: 'YarnA',
      VND_CD: 'VND001',
      VND_NM: 'Demo Vendor',
      STATUS: 'Pending',
      CREATED_BY: 'demo_user',
      DATE: new Date().toISOString().split('T')[0],
      Images: []
    }
  ]);
  const [showJsonInput, setShowJsonInput] = useState(false);

  // Add this effect to update rows when rowData changes (for Row Details modal and excelMode edit)
  useEffect(() => {
    if (rowData && ((excelMode && open) || (!excelMode && open))) {
      // If we have rowData, use it; otherwise keep the dummy data
      if (Object.keys(rowData).length > 0 && Object.values(rowData).some(val => val && val !== '')) {
      setRows([{ ...rowData }]);
      }
      // If rowData is empty or has no meaningful values, keep the existing dummy data
    }
  }, [rowData, excelMode, open, isEdit]);

  // Auto-fill today's date when modal opens in excel mode
  useEffect(() => {
    if (open && excelMode && rows.length > 0) {
      const today = new Date().toISOString().split('T')[0];
      setRows(prevRows => prevRows.map(row => ({
        ...row,
        ART_CR_DATE: row.ART_CR_DATE || today,
        DATE: row.DATE || today,
        STATUS: userRole === 'admin' ? 'Approved' : (row.STATUS || 'Pending'), // Auto-approve for admin
        CREATED_BY: userRole === 'article_creation' ? userRole : (row.CREATED_BY || '')
      })));
    }
  }, [open, excelMode, userRole]);

  // Reset rows to a single empty row when modal is closed (for Fill Excel Sheet Data modal)
  useEffect(() => {
    if (!open && excelMode) {
      // Instead of creating empty rows, restore the dummy data
      const dummyRow = {
        ART_CR_DATE: new Date().toISOString().split('T')[0],
        FG_SEG: 'APPAREL',
        FG_DIV: 'KIDS',
        SUB_DIV: 'KB-SETS',
        MJ_CAT: 'IB_B_SUIT_FS',
        MC_CD: '113030110',
        MC_DESC: 'M_TEES_HS',
        MC_ST: 'MCST001',
        MACRO_MVGR: 'Macro1',
        MICRO_MVGR: 'Micro1',
        FAB_DIV: 'Fabric1',
        YARN_01: 'Yarn1',
        YARN_02: 'YarnA',
        VND_CD: 'VND001',
        VND_NM: 'Demo Vendor',
        STATUS: 'Pending',
        CREATED_BY: 'demo_user',
        DATE: new Date().toISOString().split('T')[0],
        Images: []
      };
      setRows([dummyRow]);
    }
  }, [open, excelMode, userRole]);

  // Show upload message for 3 seconds, then hide
  useEffect(() => {
    if (uploadMessage) {
      const timer = setTimeout(() => setUploadMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [uploadMessage]);

  // Load dropdown data on component mount - COMMENTED OUT FOR DEMO
  /*
  useEffect(() => {
      fetchDropdownData();
  }, []);
  */

  // DUMMY DATA LOADING FOR DEMO
  useEffect(() => {
    // Load dummy data immediately
    setSegments(dummySegments);
    setDivisions(dummyDivisions);
    setSubDivisions(dummySubDivisions);
    setMajorCategories(dummyMajorCategories);
    setMcCodes(dummyMcCodes);
    setMcDescriptions(dummyMcDescriptions);
    setMcstDetails(dummyMcstDetails);
    setDynamicDropdowns(dummyDynamicDropdowns);
  }, []);

  // Ensure dummy data is loaded when modal opens
  useEffect(() => {
    if (open) {
      // Always ensure dummy data is loaded
      setSegments(dummySegments);
      setDivisions(dummyDivisions);
      setSubDivisions(dummySubDivisions);
      setMajorCategories(dummyMajorCategories);
      setMcCodes(dummyMcCodes);
      setMcDescriptions(dummyMcDescriptions);
      setMcstDetails(dummyMcstDetails);
      setDynamicDropdowns(dummyDynamicDropdowns);
      
      // If rows are empty, populate with dummy data
      if (rows.length === 0 || (rows.length === 1 && Object.values(rows[0]).every(val => !val || val === ''))) {
        const dummyRow = {
          ART_CR_DATE: new Date().toISOString().split('T')[0],
          FG_SEG: 'APPAREL',
          FG_DIV: 'KIDS',
          SUB_DIV: 'KB-SETS',
          MJ_CAT: 'IB_B_SUIT_FS',
          MC_CD: '113030110',
          MC_DESC: 'M_TEES_HS',
          MC_ST: 'MCST001',
          MACRO_MVGR: 'Macro1',
          MICRO_MVGR: 'Micro1',
          FAB_DIV: 'Fabric1',
          YARN_01: 'Yarn1',
          YARN_02: 'YarnA',
          VND_CD: 'VND001',
          VND_NM: 'Demo Vendor',
          STATUS: 'Pending',
          CREATED_BY: 'demo_user',
          DATE: new Date().toISOString().split('T')[0],
          Images: []
        };
        setRows([dummyRow]);
      }
    }
  }, [open]);

  // Load dynamic dropdowns when component mounts - COMMENTED OUT FOR DEMO
  /*
  useEffect(() => {
    const loadDynamicDropdowns = async () => {
      try {
        // Only include fields that are known to work (based on user's API list)
        const fields = [
          'MACRO_MVGR', 'MICRO_MVGR', 'FAB_DIV', 'YARN_01', 'YARN_02'
          // Removed problematic fields: 'FABRIC_TYPE', 'FABRIC_WEIGHT', 'FABRIC_WIDTH', 
          // 'FABRIC_COMPOSITION', 'SEASON', 'BRAND', 'COUNTRY', 'SUPPLIER', 'QUALITY_GRADE'
        ];
        
        const dropdownData = {};
        
        for (const field of fields) {
          try {
            const data = await fetchDynamicDropdownData(field);
            if (data && data.length > 0) {
              dropdownData[field] = data;
            } else {
              dropdownData[field] = [];
            }
          } catch (error) {
            // Don't log errors for individual fields - just set empty array
            dropdownData[field] = [];
          }
        }
        
        setDynamicDropdowns(dropdownData);
        } catch (error) {
        // Only log critical errors
        if (error.message && !error.message.includes('HTTP 500')) {
          logBackendError('Failed to load dynamic dropdowns', error);
        }
      }
    };
    
    loadDynamicDropdowns();
  }, []);
  */

  // Add Escape key handler to close modal
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape' && open) {

        stableHandleClose();
      }
    };

    if (open) {
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [open]); // Removed onClose from dependencies







  // Preload common dynamic dropdowns - COMMENTED OUT FOR DEMO
  /*
  const preloadDynamicDropdowns = async () => {
    setDynamicDropdownsLoading(true);
    try {
      // Only include fields that are known to work (based on user's API list)
      const fields = [
        'MACRO_MVGR', 'MICRO_MVGR', 'FAB_DIV', 'YARN_01', 'YARN_02'
        // Removed problematic fields: 'FABRIC_TYPE', 'FABRIC_WEIGHT', 'FABRIC_WIDTH', 
        // 'FABRIC_COMPOSITION', 'SEASON', 'BRAND', 'COUNTRY', 'SUPPLIER', 'QUALITY_GRADE'
      ];
      
      const dropdownData = {};
      
      for (const field of fields) {
        try {
          const data = await fetchDynamicDropdownData(field);
          if (data && data.length > 0) {
            dropdownData[field] = data;
        } else {
            dropdownData[field] = [];
        }
        } catch (error) {
          // Don't log errors for individual fields - just set empty array
          dropdownData[field] = [];
      }
      }
      
      setDynamicDropdowns(dropdownData);
    } catch (error) {
      // Only log critical errors
      if (error.message && !error.message.includes('HTTP 500')) {
        logBackendError('Failed to preload dynamic dropdowns', error);
      }
    } finally {
      setDynamicDropdownsLoading(false);
    }
  };
  */

  // DUMMY DATA LOADING FOR DEMO
  const preloadDynamicDropdowns = () => {
    setDynamicDropdownsLoading(true);
    // Simulate API delay
    setTimeout(() => {
      setDynamicDropdowns(dummyDynamicDropdowns);
      setDynamicDropdownsLoading(false);
    }, 500);
  };

  // DUMMY DATA LOADING FOR DEMO
  const fetchDropdownData = () => {
    setLoadingDropdowns(true);
    // Simulate API delay
    setTimeout(() => {
      setSegments(dummySegments);
    setLoadingDropdowns(false);
    }, 500);
  };

  // Fetch divisions by segment - COMMENTED OUT FOR DEMO
  /*
  const fetchDivisionsBySegment = async (segmentId) => {
    try {
      // Use the correct API URL and parameter as provided by user
      const response = await fetch(`http://192.168.149.75/api/Dropdown/GetAllDivisionsBySegment?segId=${segmentId}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const responseData = await response.json();
        
        if (responseData.status && responseData.data) {
          // Map backend response to frontend format
          const mappedDivisions = responseData.data.map(item => ({
            id: item.fG_DivId || item.divisionId || item.DivisionId || item.id,
            value: item.fG_DivName || item.divisionName || item.DivisionName || item.name,
            label: item.fG_DivName || item.divisionName || item.DivisionName || item.name,
            fG_DivId: item.fG_DivId || item.divisionId || item.DivisionId || item.id,
            fG_DivName: item.fG_DivName || item.divisionName || item.DivisionName || item.name
          }));
          
          setDivisions(mappedDivisions);
        } else {
          throw new Error('Invalid divisions response format');
        }
      } else {
        const errorText = await response.text();
        logBackendError('Divisions API error response', { status: response.status, message: errorText });
        throw new Error(`Failed to fetch divisions: ${response.status} - ${errorText}`);
      }
    } catch (error) {
      logBackendError('Failed to fetch divisions', error);
      setDivisions([]);
    }
  };
  */

  // DUMMY DATA LOADING FOR DEMO
  const fetchDivisionsBySegment = (segmentId) => {
    // Simulate API delay
    setTimeout(() => {
      setDivisions(dummyDivisions);
    }, 300);
  };

  // Fetch sub-divisions based on selected division - COMMENTED OUT FOR DEMO
  /*
  const fetchSubDivisions = async (divisionId) => {
    try {
      // Use the correct API URL and parameter as provided by user
      const response = await fetch(`http://192.168.149.75/api/Dropdown/GetAllSubDivisions?FG_Div=${divisionId}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        
        if (data.status && data.data) {
          // Map backend response to frontend format
          const mappedSubDivisions = data.data.map(item => ({
            id: item.subDivId || item.subDivisionId || item.SubDivisionId || item.id,
            value: item.subDivName || item.subDivisionName || item.SubDivisionName || item.name,
            label: item.subDivName || item.subDivisionName || item.SubDivisionName || item.name,
            subDivId: item.subDivId || item.subDivisionId || item.SubDivisionId || item.id,
            subDivName: item.subDivName || item.subDivisionName || item.SubDivisionName || item.name
          }));
          
          setSubDivisions(mappedSubDivisions);
        } else {
          throw new Error('Invalid sub-divisions response format');
        }
      } else {
        throw new Error(`Failed to fetch sub-divisions: ${response.status}`);
      }
    } catch (error) {
      logBackendError('Failed to fetch sub-divisions', error);
      setSubDivisions([]);
    }
  };
  */

  // DUMMY DATA LOADING FOR DEMO
  const fetchSubDivisions = (divisionId) => {
    setTimeout(() => {
      setSubDivisions(dummySubDivisions);
    }, 300);
  };

  // Fetch major categories based on selected sub-division - COMMENTED OUT FOR DEMO
  /*
  const fetchMajorCategories = async (subDivId) => {
    try {
      // Use the correct API URL and parameter as provided by user
      const response = await fetch(`http://192.168.149.75/api/Dropdown/GetAllMajorCategories?subdivId=${subDivId}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        
        if (data.status && data.data) {
          // Map backend response to frontend format
          const mappedMajorCategories = data.data.map(item => ({
            id: item.majorCatId || item.majorCategoryId || item.MajorCategoryId || item.id,
            value: item.majorCategoryName || item.majorCategoryName || item.MajorCategoryName || item.name,
            label: item.majorCategoryName || item.majorCategoryName || item.MajorCategoryName || item.name,
            majorCatId: item.majorCatId || item.majorCategoryId || item.MajorCategoryId || item.id,
            majorCategoryName: item.majorCategoryName || item.majorCategoryName || item.MajorCategoryName || item.name
          }));
          
          setMajorCategories(mappedMajorCategories);
        } else {
          throw new Error('Invalid major categories response format');
        }
      } else {
        throw new Error(`Failed to fetch major categories: ${response.status}`);
      }
    } catch (error) {
      logBackendError('Failed to fetch major categories', error);
      setMajorCategories([]);
    }
  };
  */

  // DUMMY DATA LOADING FOR DEMO
  const fetchMajorCategories = (subDivId) => {
    setTimeout(() => {
      setMajorCategories(dummyMajorCategories);
    }, 300);
  };

  // Fetch MC codes based on selected major category - COMMENTED OUT FOR DEMO
  /*
  const fetchMcCodes = async (majorCatId) => {
    try {
      // Use the correct API URL and parameter as provided by user
      const response = await fetch(`http://192.168.149.75/api/Dropdown/GetMC_CodeDetails?MajcatId=${majorCatId}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        
        if (data.status && data.data) {
          // Map backend response to frontend format
          const mappedMcCodes = data.data.map(item => ({
            id: item.mcCodeId || item.mcCodeId || item.McCodeId || item.id,
            value: item.mc_Code || item.mcCode || item.McCode || item.name,
            label: item.mc_Code || item.mcCode || item.McCode || item.name,
            mcCodeId: item.mcCodeId || item.mcCodeId || item.McCodeId || item.id,
            mc_Code: item.mc_Code || item.mcCode || item.McCode || item.name
          }));
          
          setMcCodes(mappedMcCodes);
        } else {
          throw new Error('Invalid MC codes response format');
        }
      } else {
        throw new Error(`Failed to fetch MC codes: ${response.status}`);
      }
    } catch (error) {
      logBackendError('Failed to fetch MC codes', error);
      setMcCodes([]);
    }
  };
  */

  // DUMMY DATA LOADING FOR DEMO
  const fetchMcCodes = (majorCatId) => {
    setTimeout(() => {
      setMcCodes(dummyMcCodes);
    }, 300);
  };

  // Fetch MC descriptions based on selected MC code - COMMENTED OUT FOR DEMO
  /*
  const fetchMcDescriptions = async (mcCodeId) => {
    try {
      // Use the correct API URL and parameter as provided by user
      const response = await fetch(`http://192.168.149.75/api/Dropdown/GetAllMcDescriptions?Mc_CodeId=${mcCodeId}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        
        if (data.status && data.data) {
          // Map backend response to frontend format
          const mappedMcDescriptions = data.data.map(item => ({
            id: item.mcId || item.mcDescriptionId || item.McDescriptionId || item.id,
            value: item.mC_DESC || item.mcDescription || item.McDescription || item.name,
            label: item.mC_DESC || item.mcDescription || item.McDescription || item.name,
            mcId: item.mcId || item.mcDescriptionId || item.McDescriptionId || item.id,
            mC_DESC: item.mC_DESC || item.mcDescription || item.McDescription || item.name
          }));
          
          setMcDescriptions(mappedMcDescriptions);
        } else {
          throw new Error('Invalid MC descriptions response format');
        }
      } else {
        throw new Error(`Failed to fetch MC descriptions: ${response.status}`);
      }
    } catch (error) {
      logBackendError('Failed to fetch MC descriptions', error);
      setMcDescriptions([]);
    }
  };
  */

  // DUMMY DATA LOADING FOR DEMO
  const fetchMcDescriptions = (mcCodeId) => {
    setTimeout(() => {
      setMcDescriptions(dummyMcDescriptions);
    }, 300);
  };

  // Fetch MCST details by MC ID
  const fetchMcstDetails = async (mcId) => {
    try {
      const response = await fetch(`http://192.168.149.75/api/Dropdown/GetMCSTDetails?mcId=${mcId}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        
        if (data.status && data.data) {
          setMcstDetails(data.data);
        } else {
          throw new Error('Invalid MCST details response format');
        }
      } else {
        throw new Error(`Failed to fetch MCST details: ${response.status}`);
      }
    } catch (error) {

      // Don't set fallback data - let the UI handle empty states
    }
  };

  // Fetch dynamic dropdown data for a specific field - COMMENTED OUT FOR DEMO
  /*
  const fetchDynamicDropdownData = async (field, retryCount = 0) => {
    const maxRetries = 2;
    
    try {
      // Use the correct API URL as provided by user
      const response = await fetch(`http://192.168.149.75/api/Dropdown/GetDynamicDropdownData?field=${field}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        
        if (data.status && data.data) {
          return data.data;
        } else {
          throw new Error('Invalid dynamic dropdown response format');
        }
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      if (retryCount < maxRetries) {
        // Retry with exponential backoff
        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retryCount)));
        return fetchDynamicDropdownData(field, retryCount + 1);
      }
      
      logBackendError(`Error fetching dynamic dropdown for ${field}`, error);
      return [];
    }
  };
  */

  // DUMMY DATA LOADING FOR DEMO
  const fetchDynamicDropdownData = (field) => {
    return dummyDynamicDropdowns[field] || [];
  };

  // Helper function to create dropdown options using display value for both value and label
  const createDropdownOptions = (data, valueKey, labelKey) => {
    if (!Array.isArray(data) || data.length === 0) {
      return [];
    }

    const options = data.map(item => {
      if (!item || typeof item !== 'object') {
        return null;
      }

      const value = item[valueKey];
      const label = item[labelKey];

      // Ensure both value and label exist and are valid
      if (value === undefined || value === null || label === undefined || label === null) {
        return null;
      }

      const option = {
        value: String(value), // Convert to string and use actual value
        label: String(label)  // Convert to string and use display name
      };
      return option;
    }).filter(option => option !== null); // Remove any null options

    return options;
  };

  // Tries multiple [valueKey, labelKey] pairs until options are produced
  const createDropdownOptionsFromCandidates = (data, candidateKeyPairs) => {
    if (!Array.isArray(data) || data.length === 0) {
      return [];
    }
    for (const [valueKey, labelKey] of candidateKeyPairs) {
      const options = createDropdownOptions(data, valueKey, labelKey);
      if (Array.isArray(options) && options.length > 0) {
        return options;
      }
    }
    return [];
  };

  // Get dropdown options for a specific field
  const getDropdownOptions = async (fieldName) => {
    try {
      // Handle cascading dropdowns first
      if (fieldName === "FG_SEG" || fieldName === "SEG") {
        return segments || [];
      } else if (fieldName === "FG_DIV" || fieldName === "DIV") {
        return divisions || [];
      } else if (fieldName === "SUB_DIV") {
        return subDivisions || [];
      } else if (fieldName === "MJ_CAT" || fieldName === "MAJ_CAT_NM") {
        return majorCategories || [];
      } else if (fieldName === "MC_CD") {
        return mcCodes || [];
      } else if (fieldName === "MC_DESC") {
        return mcDescriptions || [];
      } else if (fieldName === "MC_ST") {
        return mcstDetails || [];
      }
      
      // Handle dynamic dropdowns
      if (dynamicDropdowns[fieldName]) {
        return dynamicDropdowns[fieldName];
      }
      
      // If not found in preloaded data, fetch dynamically
      const data = await fetchDynamicDropdownData(fieldName);
      return data || [];
      
    } catch (error) {
      logBackendError(`Error getting dropdown options for ${fieldName}`, error);
      return [];
    }
  };

  // Get display name for column headers
  const getDisplayName = (fieldName) => {
    const displayNames = {
      // Cascading dropdown fields - show exact names as specified
      'FG_SEG': 'FG_SEG',
      'DIV': 'DIV', 
      'SUBDIV': 'SUBDIV',
      'MAJORCATE': 'MAJORCATE',
      'MC_CD': 'MC_CD',
      'MC_DESC': 'MC_DESC',
      
      // Dynamic dropdown fields
      'MACRO_MVGR': 'MACRO_MVGR',
      'MICRO_MVGR': 'MICRO_MVGR',
      'FAB_DIV': 'FAB_DIV',
      'YARN_01': 'YARN_01',
      'YARN_02': 'YARN_02',
      'MAIN_MVGR': 'MAIN_MVGR',
      'WEAVE': 'WEAVE',
      'WEAVE_2': 'WEAVE_2',
      'COMPOSITION': 'COMPOSITION',
      'FINISH': 'FINISH',
      'CONSTRUCTION': 'CONSTRUCTION',
      'GSM': 'GSM',
      'WIDTH': 'WIDTH',
      'WIDTH_UOM': 'WIDTH_UOM',
      'COUNT': 'COUNT',
      'WEIGHT_TYPE': 'WEIGHT_TYPE',
      'ORIGINAL_MATERIAL_SOURCE': 'ORIGINAL_MATERIAL_SOURCE',
      'SHADE': 'SHADE',
      'LCR_NON_LCR': 'LCR_NON_LCR',
      'NECK': 'NECK',
      'NECK_TYPE': 'NECK_TYPE',
      'NECK_SIZE': 'NECK_SIZE',
      'PLACKET': 'PLACKET',
      'FATHER_BELT': 'FATHER_BELT',
      'BELT_DESIGN': 'BELT_DESIGN',
      'BLT_SIZE': 'BLT_SIZE',
      'SLEEVE': 'SLEEVE',
      'BTM_FOLD': 'BTM_FOLD',
      'BOTTOM_OPEN_WIDTH_INC': 'BOTTOM_OPEN_WIDTH_INC',
      'SET': 'SET',
      'FO_STYLE': 'FO_STYLE',
      'POCKET_TYPE': 'POCKET_TYPE',
      'NO_OF_POCKET': 'NO_OF_POCKET',
      'FIT': 'FIT',
      'PATTERN': 'PATTERN',
      'LENGTH': 'LENGTH',
      'MEASUREMENT_LENGTH_INC': 'MEASUREMENT_LENGTH_INC',
      'DRAWCORD': 'DRAWCORD',
      'DRAWCORD_STYLE': 'DRAWCORD_STYLE',
      'DRAWCORD_LOOP': 'DRAWCORD_LOOP',
      'BUTTON': 'BUTTON',
      'BUTTON_COLOR': 'BUTTON_COLOR',
      'ZIP': 'ZIP',
      'ZIP_COL': 'ZIP_COL',
      'PRINT_TYPE': 'PRINT_TYPE',
      'PRINT_PLACEMENT': 'PRINT_PLACEMENT',
      'PRINT_STYLE': 'PRINT_STYLE',
      'PATCHES': 'PATCHES',
      'PATCH_TYPE': 'PATCH_TYPE',
      'EMBROIDERY': 'EMBROIDERY',
      'EMB_TYPE': 'EMB_TYPE',
      'PLACEMENT': 'PLACEMENT',
      'ADD_ACC1': 'ADD_ACC1',
      'WASH': 'WASH',
      'WASH_COLOR': 'WASH_COLOR',
      'CLR': 'CLR',
      'SIZE': 'SIZE',
      'MRP': 'MRP',
      'SEG': 'SEG',
      'ARTICLE_TYPE': 'ARTICLE_TYPE',
      'BUYING_TYPE': 'BUYING_TYPE',
      'PD': 'PD',
      'Images': 'Images',
      'ART_CR_DATE': 'ART_CR_DATE'
    };
    
    return displayNames[fieldName] || fieldName;
  };

  // Reorder columns based on backend mandatory fields
  const getReorderedColumns = () => {
    if (!mandatoryFields || mandatoryFields.length === 0) {
      return safeColumnDefinitions;
    }
    
    // Fixed columns that always come first
    const fixedCols = safeColumnDefinitions.filter(col => 
      col.name === "ART_CR_DATE"
    );
    
    // Cascading dropdown columns in the exact order specified
    const cascadingOrder = ["FG_SEG", "FG_DIV", "SUB_DIV", "MJ_CAT", "MC_CD", "MC_DESC"];
    const cascadingCols = [];
    
    // Build cascading columns in the exact order specified
    cascadingOrder.forEach(cascadingName => {
      const col = safeColumnDefinitions.find(c => c.name === cascadingName);
      if (col) {
        cascadingCols.push(col);
      }
    });
    
    // Mandatory fields from backend (in the order they appear in backend response)
    // BUT only if they are NOT cascading dropdowns
    const mandatoryCols = safeColumnDefinitions.filter(col => 
      mandatoryFields.includes(col.name) && 
      !cascadingOrder.includes(col.name) &&
      col.name !== "ART_CR_DATE"
    );
    
    // Dynamic dropdown columns (non-cascading, non-mandatory)
    const dynamicCols = safeColumnDefinitions.filter(col => 
      !mandatoryFields.includes(col.name) && 
      !cascadingOrder.includes(col.name) &&
      col.name !== "ART_CR_DATE"
    );
    
    // Combine all columns in the correct order
    const reorderedColumns = [
      ...fixedCols,        // ART_CR_DATE first
      ...cascadingCols,    // Cascading dropdowns in order
      ...mandatoryCols,    // Backend mandatory fields
      ...dynamicCols       // All other dynamic fields
    ];
    
    return reorderedColumns;
  };

  // Handle dropdown change and update mandatory fields
  const handleDropdownChange = async (rowIdx, fieldName, value) => {
    // Update the row value
    setRows(prevRows => prevRows.map((row, idx) =>
      idx === rowIdx ? { ...row, [fieldName]: value } : row
    ));
    
    // Handle cascading dropdowns - clear dependent fields when parent changes
    if (fieldName === "FG_SEG") {
      // Clear all dependent fields when FG_SEG changes
      setRows(prevRows => prevRows.map((row, idx) =>
        idx === rowIdx ? { ...row, FG_DIV: "", SUB_DIV: "", MJ_CAT: "", MC_CD: "", MC_DESC: "" } : row
      ));
      
      // Clear dependent dropdown data
      setDivisions([]);
      setSubDivisions([]);
      setMajorCategories([]);
      setMcCodes([]);
      setMcDescriptions([]);
      
      if (value && value.trim() !== '') {
        // Fetch divisions for selected segment
        const selectedSegment = segments.find(s => s.fG_SegName === value || s.value === value);
        if (selectedSegment) {
          const segmentId = selectedSegment.fG_SegId || selectedSegment.id;
          if (segmentId) {
            fetchDivisionsBySegment(segmentId);
          }
        }
      }
    } else if (fieldName === "FG_DIV") {
      // Clear SUB_DIV and dependent fields when FG_DIV changes
      setRows(prevRows => prevRows.map((row, idx) => 
        idx === rowIdx ? { ...row, SUB_DIV: "", MJ_CAT: "", MC_CD: "", MC_DESC: "" } : row
      ));
      
      // Clear dependent dropdown data
        setSubDivisions([]);
        setMajorCategories([]);
        setMcCodes([]);
        setMcDescriptions([]);
      
      if (value && value.trim() !== '') {
        // Fetch sub-divisions for selected division
        const selectedDivision = divisions.find(d => d.fG_DivName === value || d.value === value);
        if (selectedDivision) {
          const divisionId = selectedDivision.fG_DivId || selectedDivision.id;
          if (divisionId) {
            fetchSubDivisions(divisionId);
          }
        }
      }
    } else if (fieldName === "SUB_DIV") {
      // Clear MJ_CAT and dependent fields when SUB_DIV changes
      setRows(prevRows => prevRows.map((row, idx) =>
        idx === rowIdx ? { ...row, MJ_CAT: "", MC_CD: "", MC_DESC: "" } : row
      ));
      
      // Clear dependent dropdown data
      setMajorCategories([]);
      setMcCodes([]);
      setMcDescriptions([]);
      
      if (value && value.trim() !== '') {
        // Fetch major categories for selected sub-division
        const selectedSubDiv = subDivisions.find(sd => sd.subDivName === value || sd.value === value);
        if (selectedSubDiv) {
          const subDivId = selectedSubDiv.subDivId || selectedSubDiv.id;
          if (subDivId) {
            fetchMajorCategories(subDivId);
          }
        }
      }
    } else if (fieldName === "MJ_CAT") {
      // Clear MC_CD and MC_DESC when MJ_CAT changes
      setRows(prevRows => prevRows.map((row, idx) =>
        idx === rowIdx ? { ...row, MC_CD: "", MC_DESC: "" } : row
      ));
      
      // Clear dependent dropdown data
      setMcCodes([]);
      setMcDescriptions([]);
      
      if (value && value.trim() !== '') {
        // Fetch MC codes for selected major category
        const selectedMajorCat = majorCategories.find(mc => mc.majorCategoryName === value || mc.value === value);
        if (selectedMajorCat) {
          const majorCatId = selectedMajorCat.majorCatId || selectedMajorCat.id;
          if (majorCatId) {
            fetchMcCodes(majorCatId);
          }
        }
      }
    } else if (fieldName === "MC_CD") {
      // Clear MC_DESC when MC_CD changes
      setRows(prevRows => prevRows.map((row, idx) =>
        idx === rowIdx ? { ...row, MC_DESC: "" } : row
      ));
      
      // Clear dependent dropdown data
      setMcDescriptions([]);
        
      if (value && value.trim() !== '') {
        // Fetch MC descriptions for selected MC code
        const selectedMcCode = mcCodes.find(mc => mc.mc_Code === value || mc.value === value);
        if (selectedMcCode) {
          const mcCodeId = selectedMcCode.mcCodeId || selectedMcCode.id;
          if (mcCodeId) {
            fetchMcDescriptions(mcCodeId);
          }
        }
      }
    }
  };

  // Upload handler for Excel files
  const handleUploadExcel = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
  
      setUploadMessage("🔄 Processing Excel file...");

      // Process the Excel file locally for display
      const reader = new FileReader();
      reader.onload = async (evt) => {
        try {
          const data = new Uint8Array(evt.target.result);
          const workbook = XLSX.read(data, { type: "array" });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          const headers = json[0];
          const expectedHeaders = safeColumnDefinitions.map(col => col.name);

          

          // Check if headers match
          const headersMatch = headers.length === expectedHeaders.length &&
            headers.every((h, i) => h === expectedHeaders[i]);

          if (!headersMatch) {
            setUploadMessage("❌ Uploaded Excel headers do not match the expected template!");

            return;
          }

          // Process the data
          const newRows = json.slice(1).map(rowArr => {
            const rowObj = {};
            headers.forEach((h, i) => {
              let val = rowArr[i] || "";
              rowObj[h] = val;
            });
            return rowObj;
          });

          setRows(newRows.length > 0 ? newRows : [{ ...Object.fromEntries(safeColumnDefinitions.map(col => [col.name, ""])) }]);
          setUploadMessage(`✅ ${newRows.length} row${newRows.length !== 1 ? 's' : ''} processed successfully! Click "Save" button to insert data into database.`);

        } catch (error) {

          setUploadMessage("❌ Error processing Excel file: " + error.message);
        }
      };
      reader.readAsArrayBuffer(file);

    } catch (error) {

      setUploadMessage("❌ Error processing Excel file: " + error.message);
    }
    
  };

  // JSON text handler
  const handleJSONText = (jsonText) => {
    try {
      const jsonData = JSON.parse(jsonText);

      // Handle different JSON structures
      let articlesArray = [];
      if (Array.isArray(jsonData)) {
        // Direct array of articles
        articlesArray = jsonData;
      } else if (jsonData.articles && Array.isArray(jsonData.articles)) {
        // Wrapped in articles object
        articlesArray = jsonData.articles;
      } else if (jsonData.ArticleId || jsonData.ART_CR_DATE || jsonData.SEG) {
        // Single article object
        articlesArray = [jsonData];
      } else {
        setUploadMessage("❌ Invalid JSON structure. Expected array of articles or { articles: [...] }");
        return;
      }

      // Convert backend field names to frontend field names
      const convertedRows = articlesArray.map((article, index) => {
        const frontendRow = {};

        // Map backend field names to frontend field names - using all current column definitions
        const fieldMapping = {};
        
        // Create mapping for all current columns
        safeColumnDefinitions.forEach(col => {
          fieldMapping[col.name] = col.name; // Direct mapping since we're using the same names
        });
        
        // Map fields from backend to frontend
        Object.keys(article).forEach(backendField => {
          const frontendField = fieldMapping[backendField] || backendField;
          frontendRow[frontendField] = article[backendField];
        });
        
        return frontendRow;
      });

      // Set the converted rows
      setRows(convertedRows);
      setUploadMessage(`✅ ${convertedRows.length} article(s) loaded successfully! Click "Save" button to insert data into database.`);

    } catch (err) {
      setUploadMessage("❌ Invalid JSON format: " + err.message);
    }
  };






  const removeRow = (idx) => {
    if (readOnly) return;
    setRows(rows.length > 1 ? rows.filter((_, i) => i !== idx) : rows);
  };

  const addRowWithData = () => {
    if (rows.length > 0) {
      const lastRow = rows[rows.length - 1];
      const newRow = { ...lastRow };
      // Clear Images field for new row
      newRow.Images = [];
      // Set today's date for ART_CR_DATE
      const today = new Date().toISOString().split('T')[0];
      newRow.ART_CR_DATE = today;
      newRow.DATE = today;
      setRows([...rows, newRow]);
    }
    setShowAddRowPopup(false);
  };

  const addBlankRow = () => {
    const blankRow = { ...Object.fromEntries(safeColumnDefinitions.map(col => [col.name, ""])) };
    blankRow.Images = [];
    // Set today's date for ART_CR_DATE
    blankRow.ART_CR_DATE = new Date().toISOString().split('T')[0];
    setRows([...rows, blankRow]);
    setShowAddRowPopup(false);
  };

  // Add demo row for better demo experience
  const addDemoRow = () => {
    const newRow = {
      ART_CR_DATE: new Date().toISOString().split('T')[0],
      FG_SEG: 'FOOTWEAR',
      FG_DIV: 'MEN',
      SUB_DIV: 'MB-SHIRTS',
      MJ_CAT: 'IB_B_SHIRT_FS',
      MC_CD: '113030120',
      MC_DESC: 'M_SHIRTS_HS',
      MACRO_MVGR: 'Macro2',
      MICRO_MVGR: 'Micro2',
      FAB_DIV: 'Fabric2',
      YARN_01: 'Yarn2',
      YARN_02: 'YarnB',
      VND_CD: 'VND002',
      VND_NM: 'Demo Vendor 2',
      STATUS: 'Pending',
      CREATED_BY: 'demo_user',
      DATE: new Date().toISOString().split('T')[0],
      Images: []
    };
    
    setRows(prevRows => [...prevRows, newRow]);
  };

  // Reset demo data
  const resetDemoData = () => {
    setRows([
      {
        ART_CR_DATE: new Date().toISOString().split('T')[0],
        FG_SEG: 'APPAREL',
        FG_DIV: 'KIDS',
        SUB_DIV: 'KB-SETS',
        MJ_CAT: 'IB_B_SUIT_FS',
        MC_CD: '113030110',
        MC_DESC: 'M_TEES_HS',
        MACRO_MVGR: 'Macro1',
        MICRO_MVGR: 'Micro1',
        FAB_DIV: 'Fabric1',
        YARN_01: 'Yarn1',
        YARN_02: 'YarnA',
        VND_CD: 'VND001',
        VND_NM: 'Demo Vendor',
        STATUS: 'Pending',
        CREATED_BY: 'demo_user',
        DATE: new Date().toISOString().split('T')[0],
        Images: []
      }
    ]);
  };









  // Handle save button click - COMMENTED OUT FOR DEMO
  /*
  const handleSave = async () => {
    if (rows.length === 0) {
      alert('No data to save');
      return;
    }

      setSaving(true);
    setUploadMessage("");

    try {
      // Check what fields are actually available in the data
      const availableFields = rows[0] ? Object.keys(rows[0]) : [];
      
      // Validate required fields before sending - be more flexible with field names
      const requiredFields = ['MC_CD', 'MC_DESC', 'VND_CD', 'VND_NM'];
      const requiredFieldErrors = [];
      
      for (const field of requiredFields) {
        let fieldValue = rows[0]?.[field];
        if (!fieldValue || fieldValue.toString().trim() === '') {
          // Try alternative field names
          if (field === 'MC_CD') {
            fieldValue = rows[0]?.['MC_CODE'] || rows[0]?.['mc_code'] || rows[0]?.['mcCode'];
          } else if (field === 'MC_DESC') {
            fieldValue = rows[0]?.['ARTICLE_DESCRIPTION'] || rows[0]?.['article_description'] || rows[0]?.['articleDescription'];
          } else if (field === 'VND_CD') {
            fieldValue = rows[0]?.['VENDOR_CODE'] || rows[0]?.['vendor_code'] || rows[0]?.['vendorCode'];
          } else if (field === 'VND_NM') {
            fieldValue = rows[0]?.['VENDOR_NAME'] || rows[0]?.['vendor_name'] || rows[0]?.['vendorName'];
          }
        }
        
        if (!fieldValue || fieldValue.toString().trim() === '') {
          requiredFieldErrors.push(field);
        }
      }
      
      if (requiredFieldErrors.length > 0) {
        throw new Error(`Missing required fields: ${requiredFieldErrors.join(', ')}`);
      }

      // Prepare data for API - transform field names to match backend expectations
      const dataToSend = rows.map(row => {
        const rowData = { ...row };
        
        // Ensure required fields have values
        if (!rowData.MC_CD || rowData.MC_CD.toString().trim() === '') {
          rowData.MC_CD = row.MC_CD || row.MC_CODE || row.mc_code || row.mcCode || 'DEFAULT_MC_CD';
        }
        if (!rowData.MC_DESC || rowData.MC_DESC.toString().trim() === '') {
          rowData.MC_DESC = row.MC_DESC || row.ARTICLE_DESCRIPTION || row.article_description || row.articleDescription || 'DEFAULT_MC_DESC';
        }
        if (!rowData.VND_CD || rowData.VND_CD.toString().trim() === '') {
          rowData.VND_CD = row.VND_CD || row.VENDOR_CODE || row.vendor_code || row.vendorCode || 'DEFAULT_VND_CD';
        }
        if (!rowData.VND_NM || rowData.VND_NM.toString().trim() === '') {
          rowData.VND_NM = row.VND_NM || row.VENDOR_NAME || row.vendor_name || row.vendorName || 'DEFAULT_VND_NM';
        }
        
        // Set default values for other important fields if missing
        if (!rowData.STATUS || rowData.STATUS.toString().trim() === '') {
          rowData.STATUS = userRole === 'admin' ? 'Approved' : 'Pending';
        }
        if (!rowData.CREATED_BY || rowData.CREATED_BY.toString().trim() === '') {
          rowData.CREATED_BY = userRole === 'article_creation' ? userRole : 'System';
        }
        if (!rowData.ART_CR_DATE || rowData.ART_CR_DATE.toString().trim() === '') {
          rowData.ART_CR_DATE = new Date().toISOString().split('T')[0];
        }
        if (!rowData.DATE || rowData.DATE.toString().trim() === '') {
          rowData.DATE = new Date().toISOString().split('T')[0];
        }
        
        return rowData;
      });
      
      let response;
      let result;

      // Try multiple data formats to find one that works with the backend
      try {
        // First attempt: Send as array
        response = await fetch('http://192.168.149.75/api/Article/InsertArticleData', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend)
      });
      
        if (response.ok) {
          result = await response.json();
        } else {
          // Get detailed error information
          const errorText = await response.text();
          let errorData;
          try {
            errorData = JSON.parse(errorText);
          } catch (e) {
            errorData = { message: errorText };
          }
          
          const firstError = new Error(`HTTP ${response.status}: ${errorData.message || errorText}`);
          throw firstError;
        }
      } catch (firstError) {
        // Second attempt: Send first row as single object
        try {
          response = await fetch('http://192.168.149.75/api/Article/InsertArticleData', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataToSend[0])
          });

          if (response.ok) {
            result = await response.json();
      } else {
            const errorText = await response.text();
            let errorData;
            try {
              errorData = JSON.parse(errorText);
            } catch (e) {
              errorData = { message: errorText };
            }
            
            const secondError = new Error(`HTTP ${response.status}: ${errorData.message || errorText}`);
            throw secondError;
          }
        } catch (secondError) {
          // Third attempt: Send with simplified data structure
          try {
            const simplifiedData = dataToSend.map(row => ({
              MC_CD: row.MC_CD,
              MC_DESC: row.MC_DESC,
              VND_CD: row.VND_CD,
              VND_NM: row.VND_NM,
              STATUS: row.STATUS || 'Pending',
              CREATED_BY: row.CREATED_BY || userRole,
              ART_CR_DATE: row.ART_CR_DATE || new Date().toISOString().split('T')[0],
              DATE: row.DATE || new Date().toISOString().split('T')[0]
            }));

            response = await fetch('http://192.168.149.75/api/Article/InsertArticleData', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(simplifiedData)
            });

            if (response.ok) {
              result = await response.json();
            } else {
              const errorText = await response.text();
              let errorData;
              try {
                errorData = JSON.parse(errorText);
              } catch (e) {
                errorData = { message: errorText };
              }
              
              const thirdError = new Error(`HTTP ${response.status}: ${errorData.message || errorText}`);
              throw thirdError;
            }
          } catch (thirdError) {
            throw new Error(`All data formats failed. First: ${firstError.message}, Second: ${secondError.message}, Third: ${thirdError.message}`);
          }
        }
      }

      // Check if save was successful
      if (result && result.status === true) {
        alert('✅ Article saved successfully!');
        setRows([]);
        stableHandleClose();
      } else {
        throw new Error(`Save failed - Unexpected response: ${JSON.stringify(result)}`);
      }
      
    } catch (error) {
      alert(`❌ Save error: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };
  */

  // DUMMY SAVE FOR DEMO
  const handleSave = () => {
    if (rows.length === 0) {
      alert('No data to save');
        return;
      }

    setSaving(true);
    setUploadMessage("");

    // Simulate API delay
    setTimeout(() => {
      const successMessage = `✅ Article saved successfully! (DEMO MODE)

📊 Data Summary:
• Total Rows: ${rows.length}
• Sample Data: ${rows[0]?.MC_CD || 'N/A'} - ${rows[0]?.MC_DESC || 'N/A'}
• Vendor: ${rows[0]?.VND_CD || 'N/A'} - ${rows[0]?.VND_NM || 'N/A'}

🎭 This is demo mode - no actual backend API calls were made.`;
      
      // Show toast message instead of alert
      if (window.showToast) {
        window.showToast(successMessage, 'success');
      } else {
        // Fallback to simple notification
        console.log('Toast notification:', successMessage);
      }
      
      // Call onSave callback to pass data to parent component
      if (onSave && typeof onSave === 'function') {
        // Transform rows to match the expected format for the parent component
        const transformedRows = rows.map(row => ({
          ...row,
          ArticleId: `MC${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, // Generate unique ID
          STATUS: userRole === 'admin' ? 'Approved' : 'Pending',
          DATE: new Date().toISOString().split('T')[0],
          ART_CR_DATE: new Date().toISOString().split('T')[0],
          CREATED_BY: userRole || 'article_creation'
        }));
        
        // Show admin auto-approval message
        if (userRole === 'admin') {
          const adminMessage = `👑 Admin Auto-Approval: Article automatically approved with status "Approved"`;
          if (window.showToast) {
            window.showToast(adminMessage, 'info');
          }
        }
        
        onSave(transformedRows);
      }
      
      setRows([]);
      stableHandleClose();
      setSaving(false);
    }, 1000);
  };

  // Handle save as draft - COMMENTED OUT FOR DEMO
  /*
  const handleSaveAsDraft = async () => {
    if (!rows || rows.length === 0) {
      alert('No data to save as draft');
      return;
    }

    setSaving(true);
    setUploadMessage("");

    try {
      // Prepare draft data
      const draftData = {
        articles: rows,
        status: 'Draft',
        createdBy: userRole,
        createdAt: new Date().toISOString()
      };

      // Send draft data to API
      const response = await fetch('http://192.168.149.75/api/Article/SaveAsDraft', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(draftData)
      });

      if (response.ok) {
        const result = await response.json();
        
        if (result.status === true) {
          alert('✅ Draft saved successfully!');
          setRows([]);
          stableHandleClose();
        } else {
          throw new Error(`Draft save failed: ${result.message || 'Unknown error'}`);
        }
      } else {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

    } catch (error) {
      alert(`❌ Error saving draft: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };
  */

  // DUMMY DRAFT SAVE FOR DEMO
  const handleSaveAsDraft = () => {
    if (!rows || rows.length === 0) {
      alert('No data to save as draft');
      return;
    }

    setSaving(true);
    setUploadMessage("");

    // Simulate API delay
        setTimeout(() => {
      const successMessage = `✅ Draft saved successfully! (DEMO MODE)

📊 Draft Summary:
• Total Rows: ${rows.length}
• Status: Draft
• Created By: ${userRole || 'demo_user'}
• Created At: ${new Date().toLocaleString()}

🎭 This is demo mode - no actual backend API calls were made.`;
      
      alert(successMessage);
      setRows([]);
      stableHandleClose();
      setSaving(false);
    }, 1000);
  };



  // Wrapper function for onClose with logging
  const handleClose = () => {
    stableHandleClose();
  };

  // Use ref to store onClose function to avoid dependency issues
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  // Stable close handler using useRef
  const stableHandleClose = () => {
    if (onCloseRef.current) {
      onCloseRef.current();
    }
  };

  if (!open) return null;

  // Add CSS for spinner animation and message animations
  const spinnerStyle = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    @keyframes slideDown {
      0% { 
        transform: translateX(-50%) translateY(-100%);
        opacity: 0;
      }
      100% { 
        transform: translateX(-50%) translateY(0);
        opacity: 1;
      }
    }
  `;

  // Add CSS for mandatory fields
  const mandatoryFieldStyles = `
    .mandatory-field {
      border-color: #ef4444 !important;
      background-color: #fef2f2 !important;
    }
    
    .mandatory-field:focus {
      border-color: #dc2626 !important;
      box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.2) !important;
    }
    
    .mandatory-label {
      color: #dc2626 !important;
      font-weight: 600 !important;
    }
  `;

  // RENDERING LOGIC
    return (
    <>
      <style>{spinnerStyle}</style>
      <style>{mandatoryFieldStyles}</style>
      {excelMode ? (
      <div className="apv-modal-overlay" onClick={stableHandleClose}>
        <div className="apv-modal-content apv-attractive" onClick={(e) => e.stopPropagation()} style={{
          maxWidth: '98vw',
          width: '98vw',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div className="apv-modal-header">
            <h3 className="apv-modal-title" style={{
              color: '#1e3a8a',
                fontWeight: 600,
                fontSize: '18px',
              margin: 0,
                letterSpacing: '-0.02em'
            }}>
                {isEdit ? 'Update Excel Sheet' : 'Insert Article'}
            </h3>
            <button 
              className="apv-modal-close" 
              onClick={stableHandleClose}
              style={{
                cursor: 'pointer',
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#6b7280',
                background: 'none',
                border: 'none',
                padding: '8px',
                borderRadius: '4px',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#f3f4f6';
                e.target.style.color = '#374151';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = '#6b7280';
              }}
            >
              &times;
            </button>
          </div>

          {/* Scrollable content area */}
          <div style={{
            flex: 1,
            overflow: 'hidden',
            padding: '0 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            minHeight: 0
          }}>
            {/* Buttons row */}
            <div style={{ display: 'flex', gap: '0.25rem', margin: '0.25rem 0', alignItems: 'center', flexWrap: 'wrap' }}>
              
              <label className="btn btn-outline-primary mb-0" style={{
                borderColor: '#8b5cf6',
                color: '#8b5cf6',
                backgroundColor: 'transparent',
                padding: '4px 8px',
                fontSize: '0.75rem',
                  minHeight: '28px',
                  borderRadius: '20px',
                  borderWidth: '2px'
              }}>
                Upload Excel
                <input type="file" accept=".xlsx,.xls" style={{ display: 'none' }} onChange={handleUploadExcel} />
              </label>
              <button
                className="btn btn-outline-warning mb-0"
                onClick={() => setShowJsonInput(!showJsonInput)}
                style={{
                  borderColor: '#f59e0b',
                  color: '#f59e0b',
                  backgroundColor: 'transparent',
                  padding: '4px 8px',
                  fontSize: '0.75rem',
                    minHeight: '28px',
                    borderRadius: '20px',
                    borderWidth: '2px'
                }}
              >
                {showJsonInput ? 'Hide JSON Input' : 'Type JSON'}
              </button>
              <button className="btn btn-success" onClick={handleSave} disabled={saving} style={{
                backgroundColor: isEdit ? '#f59e0b' : '#10b981',
                borderColor: isEdit ? '#f59e0b' : '#10b981',
                padding: '4px 8px',
                fontSize: '0.75rem',
                  minHeight: '28px',
                  borderRadius: '20px'
              }}>{isEdit ? 'Update' : 'Insert Article'}</button>
              
              {/* Save as Draft button - only show for admin users */}
              {userRole === 'admin' && (
                <button 
                  className="btn btn-outline-secondary" 
                  onClick={() => handleSaveAsDraft()} 
                  disabled={saving}
                  style={{
                    borderColor: '#6b7280',
                    color: '#6b7280',
                    backgroundColor: 'transparent',
                    padding: '4px 8px',
                    fontSize: '0.75rem',
                    minHeight: '28px',
                    borderRadius: '20px',
                    borderWidth: '2px'
                  }}
                >
                  Save as Draft
                </button>
              )}
                              <button 
                className="btn btn-info" 
                onClick={() => setShowAddRowPopup(true)}
                style={{
                  backgroundColor: '#0ea5e9',
                  borderColor: '#0ea5e9',
                padding: '4px 8px',
                fontSize: '0.75rem',
                  minHeight: '28px',
                  borderRadius: '20px',
                  color: 'white'
                }}
              >
                Add Row
              </button>
            </div>

              {/* Add Row Popup */}
              {showAddRowPopup && (
                <div style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'rgba(0, 0, 0, 0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 1000
                }}>
                  <div style={{
                    background: 'white',
                    padding: '2rem',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
                    maxWidth: '400px',
                    width: '90%',
                    textAlign: 'center'
                  }}>
                    <h4 style={{ 
                      color: '#1e3a8a', 
                      marginBottom: '1.5rem',
                      fontSize: '18px',
                      fontWeight: '600'
                    }}>
                      Add New Row
                    </h4>
                    <p style={{ 
                      color: '#6b7280', 
                      marginBottom: '2rem',
                      fontSize: '14px'
                    }}>
                      Choose how you want to add the new row:
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                      <button 
                        className="btn btn-primary"
                        onClick={addRowWithData}
                        style={{
                          backgroundColor: '#3b82f6',
                          borderColor: '#3b82f6',
                          padding: '8px 16px',
                          fontSize: '14px',
                          borderRadius: '8px',
                          minWidth: '120px'
                        }}
                      >
                        Copy Previous Row Data
                      </button>
                      <button 
                        className="btn btn-outline-secondary"
                        onClick={addBlankRow}
                        style={{
                          borderColor: '#6b7280',
                          color: '#6b7280',
                          backgroundColor: 'transparent',
                          padding: '8px 16px',
                          fontSize: '14px',
                          borderRadius: '8px',
                          minWidth: '120px'
                        }}
                      >
                        Add Blank Row
                      </button>
                    </div>
                    <button 
                      className="btn btn-link"
                      onClick={() => setShowAddRowPopup(false)}
                      style={{
                        marginTop: '1.5rem',
                        color: '#9ca3af',
                        textDecoration: 'none',
                        border: 'none',
                        background: 'none',
                        cursor: 'pointer',
                        fontSize: '14px'
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

            {/* JSON Text Input */}
            {showJsonInput && (
              <div style={{
                marginBottom: '1rem',
                  padding: '1.5rem',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                  background: 'transparent',
                color: '#374151'
              }}>
                <div style={{ marginBottom: '0.5rem', fontWeight: 'bold', color: '#1f2937' }}>
                  Type or Paste JSON Data:
                </div>
                <textarea
                    value=""
                    onChange={(e) => {}}
                  placeholder="Paste your JSON data here... Example: [{'ART_CR_DATE': '2025-07-25T10:00:00', 'FG_SEG': 'APP', 'FG_DIV': 'MENS'}]"
                  className="bg-white"
                  style={{
                    width: '100%',
                    minHeight: '120px',
                    padding: '0.5rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    fontFamily: 'monospace',
                    fontSize: '12px',
                    resize: 'vertical',
                    color: '#374151'
                  }}
                />
                <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem' }}>
                  <button
                    className="btn btn-primary btn-sm bg-purple-500"
                    onClick={() => {}}
                    disabled={true}
                    style={{
                      borderColor: '#8b5cf6',
                      padding: '3px 6px',
                      fontSize: '0.7rem',
                      minHeight: '24px'
                    }}
                  >
                    Load JSON Data
                  </button>
                  <button
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => {}}
                    style={{
                      borderColor: '#9ca3af',
                      color: '#6b7280',
                      padding: '3px 6px',
                      fontSize: '0.7rem',
                      minHeight: '24px'
                    }}
                  >
                    Clear
                  </button>
                </div>
              </div>
            )}



            {/* Upload message */}
            {uploadMessage && (
              <div className={`toast-notification ${
                uploadMessage.startsWith('✅') ? 'toast-success' : 
                uploadMessage.startsWith('🔄') ? 'toast-info' : 
                uploadMessage.startsWith('⚠️') ? 'toast-warning' : 'toast-error'
              }`}>
                <span style={{ fontSize: '14px', fontWeight: '600' }}>{uploadMessage}</span>
                <button
                  onClick={() => setUploadMessage("")}
                  style={{
                    background: 'rgba(0, 0, 0, 0.1)',
                    border: 'none',
                    color: 'inherit',
                    cursor: 'pointer',
                    fontSize: '20px',
                    fontWeight: 'bold',
                    padding: '4px 8px',
                    marginLeft: '16px',
                    borderRadius: '50%',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => e.target.style.background = 'rgba(0, 0, 0, 0.2)'}
                  onMouseLeave={(e) => e.target.style.background = 'rgba(0, 0, 0, 0.1)'}
                  title="Close message"
                >
                  ×
                </button>
              </div>
            )}





            {/* Table container with fixed height */}
            <div style={{
              flex: 1,
              minHeight: 0,
              display: 'flex',
              flexDirection: 'column'
            }}>
              <div className="table-container makeMyTableScrollable border-table" style={{
                flex: 1,
                overflow: 'auto',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                minHeight: 0,
                position: 'relative',
                marginTop: '0.5rem'
              }}>
                <table className="table table-striped table-hover table-bordered table-sm bg-white" style={{
                  color: '#374151',
                  width: '100%',
                  borderSpacing: '0',
                  borderCollapse: 'collapse'
                }}>
                  <thead className="table-secondary makeMyHeadFixed bg-gray-100" style={{
                    color: '#1f2937'
                  }}>
                    <tr>
                      {getReorderedColumns().map((col, index) => (
                        <th key={`${col.name}-${index}`} className="bg-gray-100" style={{
                          textAlign: "center",
                          verticalAlign: "middle",
                          minWidth: col.name === "Images" ? '80px' : col.name === "Action" ? '60px' : 120,
                          color: '#1f2937',
                          borderColor: '#d1d5db',
                          border: '1px solid #d1d5db',
                          fontSize: '11px',
                          padding: '6px 4px',
                          fontWeight: '600',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          // Only make Images and Action columns sticky to the right
                          ...(col.name === "Images" && {
                            position: 'sticky',
                            right: 60, // Position Images column to the left of Action column
                            zIndex: 10,
                            borderLeft: '2px solid #d1d5db',
                            borderRight: '1px solid #d1d5db',
                            width: '80px'
                          }),
                          ...(col.name === "Action" && {
                            position: 'sticky',
                            right: 0,
                            zIndex: 11,
                            borderLeft: '2px solid #d1d5db',
                            borderRight: '1px solid #d1d5db',
                            width: '60px'
                          })
                        }}>
                          {getDisplayName(col.name)}
                          {mandatoryFields.includes(col.name) && (
                            <span style={{ color: '#ef4444', marginLeft: 4, fontWeight: 'bold' }}>*</span>
                          )}
                        </th>
                      ))}
                      <th style={{
                        textAlign: "center",
                        verticalAlign: "middle",
                        minWidth: 60,
                        position: 'sticky',
                        right: 0,
                        backgroundColor: '#f3f4f6',
                        zIndex: 11,
                        color: '#1f2937',
                        borderColor: '#d1d5db',
                        border: '1px solid #d1d5db',
                        borderLeft: '2px solid #d1d5db',
                        fontSize: '11px',
                        padding: '6px 4px',
                        fontWeight: '600',
                        width: '60px'
                      }}>Action</th>
                    </tr>
                  </thead>
                  <tbody className="table-body" style={{ textAlign: "center" }}>
                    {rows.map((row, rowIdx) => (
                      <tr key={rowIdx} style={{ borderColor: '#d1d5db', border: '1px solid #d1d5db', margin: '0', padding: '0' }}>
                        {getReorderedColumns().map((col, colIdx) => (
                          <td key={`${col.name}-${rowIdx}-${colIdx}`}                           className={`${col.name === "Images" ? 'sticky-column' : ''} ${col.name === "Action" ? 'sticky-column' : ''}`}
                          style={{
                            borderColor: '#d1d5db',
                            border: '1px solid #d1d5db',
                            minWidth: col.name === "Images" ? '80px' : col.name === "Action" ? '60px' : 120,
                          padding: '6px 4px',
                            // Only make Images and Action columns sticky to the right
                            ...(col.name === "Images" && {
                              position: 'sticky',
                              right: 60, // Position Images column to the left of Action column
                              zIndex: 10,
                              borderLeft: '2px solid #d1d5db',
                              borderRight: '1px solid #d1d5db',
                              width: '80px'
                            }),
                            ...(col.name === "Action" && {
                              position: 'sticky',
                              right: 0,
                              zIndex: 11,
                              borderLeft: '2px solid #d1d5db',
                              borderRight: '1px solid #d1d5db',
                              width: '60px'
                            })
                          }}>
                            {col.name === "Images" ? (
                              <div style={{ padding: '4px', textAlign: 'center' }}>
                                {/* Image Preview Section */}
                                {row[col.name] && Array.isArray(row[col.name]) && row[col.name].length > 0 && (
                                  <div style={{ marginBottom: '4px' }}>
                                    {row[col.name].slice(0, 2).map((image, imgIdx) => (
                                      <div key={imgIdx} style={{ 
                                        position: 'relative', 
                                        display: 'inline-block', 
                                        margin: '1px',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '4px',
                                        overflow: 'hidden'
                                      }}>
                                        <img
                                          src={image}
                                          alt={`Image ${imgIdx + 1}`}
                                          style={{
                                            width: '40px',
                                            height: '40px',
                                            objectFit: 'cover',
                                            display: 'block'
                                          }}
                                          onError={(e) => {
                                            e.target.style.display = 'none';
                                            e.target.nextSibling.style.display = 'block';
                                          }}
                                        />
                                        <div className="bg-gray-100" style={{
                                          display: 'none',
                                          width: '40px',
                                          height: '40px',
                                          color: '#6b7280',
                                          fontSize: '8px',
                                          textAlign: 'center',
                                          lineHeight: '40px',
                                          border: '1px solid #d1d5db'
                                        }}>
                                          IMG
                                        </div>
                                                                                <button
                                          onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            const updatedImages = row[col.name].filter((_, idx) => idx !== imgIdx);
                                            setRows(prevRows => prevRows.map((prevRow, idx) =>
                                              idx === rowIdx ? { ...prevRow, Images: updatedImages } : prevRow
                                            ));
                                          }}
                                          className="bg-red-500"
                                          style={{
                                            position: 'absolute',
                                            top: '-5px',
                                            right: '-5px',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '50%',
                                            width: '16px',
                                            height: '16px',
                                            fontSize: '10px',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            lineHeight: 1
                                          }}
                                          title="Remove image"
                                        >
                                          ×
                                        </button>
                                      </div>
                                    ))}
                                    {row[col.name].length > 2 && (
                                      <div style={{
                                        display: 'inline-block',
                                        width: '40px',
                                        height: '40px',
                                        backgroundColor: '#6b7280',
                                        color: 'white',
                                        fontSize: '8px',
                                        textAlign: 'center',
                                        lineHeight: '40px',
                                        borderRadius: '4px',
                                        margin: '1px'
                                      }}>
                                        +{row[col.name].length - 2}
                                      </div>
                                    )}
                                  </div>
                                )}
                                
                                {/* Upload Button */}
                                <label style={{ cursor: 'pointer', margin: 0, position: 'relative' }}>
                                  {row.isImageLoading ? (
                                    <div style={{
                                      width: '16px',
                                      height: '16px',
                                      border: '2px solid #3b82f6',
                                      borderTop: '2px solid transparent',
                                      borderRadius: '50%',
                                      animation: 'spin 1s linear infinite',
                                      margin: '0 auto'
                                    }} />
                                  ) : (
                                    <FaUpload style={{ 
                                      color: '#3b82f6', 
                                      fontSize: '16px',
                                      display: 'block',
                                      margin: '0 auto'
                                    }} />
                                  )}
                                  
                                  {/* Image Count Badge */}
                                  {row[col.name] && Array.isArray(row[col.name]) && row[col.name].length > 0 && (
                                    <div style={{
                                      position: 'absolute',
                                      top: '-8px',
                                      right: '-8px',
                                      background: '#10b981',
                                      color: 'white',
                                      borderRadius: '50%',
                                      width: '16px',
                                      height: '16px',
                                      fontSize: '10px',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      fontWeight: 'bold'
                                    }}>
                                      {row[col.name].length}
                                    </div>
                                  )}
                                  
                                  {/* Upload Status Tooltip */}
                                  <div style={{
                                    position: 'absolute',
                                    bottom: '100%',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    background: '#1f2937',
                                    color: 'white',
                                    padding: '4px 8px',
                                    borderRadius: '4px',
                                    fontSize: '10px',
                                    whiteSpace: 'nowrap',
                                    opacity: 0,
                                    pointerEvents: 'none',
                                    transition: 'opacity 0.2s',
                                    zIndex: 10
                                  }} 
                                  onMouseEnter={(e) => e.target.style.opacity = '1'}
                                  onMouseLeave={(e) => e.target.style.opacity = '0'}
                                >
                                    {row[col.name] && Array.isArray(row[col.name]) && row[col.name].length > 0 
                                      ? `${row[col.name].length} image${row[col.name].length !== 1 ? 's' : ''} uploaded`
                                      : 'Click to upload images'
                                    }
                                  </div>
                              <input
                                  type="file"
                                  multiple
                                  accept="image/*"
                                    style={{ display: 'none' }}
                                  onChange={async (e) => {
                                    // Show loading state
                                    const loadingRow = rowIdx;
                                    setRows(prevRows => prevRows.map((prevRow, idx) =>
                                      idx === loadingRow ? { ...prevRow, isImageLoading: true } : prevRow
                                    ));
                                    
                                    const files = Array.from(e.target.files);
                                    const base64Images = [];


                                    
                                    for (const file of files) {

                                      
                                      if (file.type.startsWith('image/')) {
                                        try {
                                          // Convert file to base64 immediately
                                            const base64 = await new Promise((resolve) => {
                                              const reader = new FileReader();
                                              reader.onload = () => resolve(reader.result);
                                              reader.readAsDataURL(file);
                                            });
                                          base64Images.push(base64);

                                        } catch (error) {
  
                                        }
                                      }
                                    }



                                    // Merge new base64 images with existing images
                                    const existingImages = row[col.name] || [];
                                    // Filter out empty arrays and ensure we have valid images
                                    const validExistingImages = Array.isArray(existingImages) 
                                      ? existingImages.filter(img => 
                                          img && 
                                          img !== 'null' && 
                                          img !== 'undefined' && 
                                          img !== '' &&
                                          (typeof img === 'string' && img.trim() !== '')
                                        )
                                      : [];
                                    
                                    const allImages = [...validExistingImages, ...base64Images];
                                    

                                    
                                    setRows(prevRows => prevRows.map((prevRow, idx) =>
                                        idx === rowIdx ? { ...prevRow, Images: allImages, isImageLoading: false } : prevRow
                                    ));
                                  }}
                                />
                                </label>
                              </div>
                            ) : col.type === "date" ? (
                              <input
                                type="date"
                                className="form-control form-control-sm"
                                value={row[col.name] ? String(row[col.name]).slice(0, 10) : ''}
                                onChange={e => handleDropdownChange(rowIdx, col.name, e.target.value)}
                                          style={{
                                  background: !row[col.name] ? '#fff3cd' : '#ffffff',
                                  borderColor: !row[col.name] ? '#ffc107' : '#d1d5db',
                                  color: '#374151',
                                  width: '100%',
                                  borderRadius: '20px',
                                  padding: '6px 12px',
                                  fontSize: '11px',
                                  borderWidth: !row[col.name] ? '2px' : '1px'
                                }}
                                required
                              />
                            ) : (
                              <select
                                className="form-control form-control-sm"
                                value={row[col.name] ? String(row[col.name]) : ''}
                                onChange={e => handleDropdownChange(rowIdx, col.name, e.target.value)}
                                style={{
                                  background: '#ffffff',
                                  borderColor: '#d1d5db',
                                  color: '#374151',
                                  width: '100%',
                                  borderRadius: '20px',
                                  padding: '6px 12px',
                                  fontSize: '11px',
                                    borderWidth: '1px'
                                }}
                              >
                                <option value="">
                                  {getDisplayName(col.name)}
                                </option>
                                  {(() => {
                                  // Use preloaded dropdown data instead of calling async function
                                  let options = [];
                                  
                                  // Check if this is a cascading dropdown field
                                  if (col.name === 'FG_SEG' || col.name === 'SEG' || col.name === 'FG_SegName') {
                                    options = Array.isArray(segments) ? segments : [];
  
                                  } else if (col.name === 'FG_DIV' || col.name === 'DIV' || col.name === 'FG_DivName') {
                                    options = Array.isArray(divisions) ? divisions : [];

                                  } else if (col.name === 'SUB_DIV') {
                                    options = Array.isArray(subDivisions) ? subDivisions : [];

                                  } else if (col.name === 'MJ_CAT') {
                                    options = Array.isArray(majorCategories) ? majorCategories : [];

                                  } else if (col.name === 'MC_CODE' || col.name === 'MC_CD') {
                                    options = Array.isArray(mcCodes) ? mcCodes : [];

                                  } else if (col.name === 'MC_DESC') {
                                    options = Array.isArray(mcDescriptions) ? mcDescriptions : [];

                                  } else if (col.name === 'MC_ST') {
                                    options = Array.isArray(mcstDetails) ? mcstDetails : [];
                                  } else {
                                    // For dynamic fields, use preloaded data
                                    const dynamicData = dynamicDropdowns[col.name];
                                    options = Array.isArray(dynamicData) ? dynamicData : [];

                                  }
                                  
                                  // Ensure options is always an array
                                  if (!Array.isArray(options)) {
  
                                    options = [];
                                  }
                                  
                                  if (options.length === 0) {
                                    // Check if this is a dynamic field that should have data
                                    const isDynamicField = [
                                      'MICRO_MVGR', 'FAB_DIV', 'YARN_01', 'YARN_02', 'MAIN_MVGR',
                                      'WEAVE', 'WEAVE_2', 'COMPOSITION', 'FINISH', 'CONSTRUCTION',
                                      'GSM', 'WIDTH', 'WIDTH_UOM', 'COUNT', 'WEIGHT_TYPE',
                                      'ORIGINAL_MATERIAL_SOURCE', 'SHADE', 'LCR_NON_LCR',
                                      'NECK', 'NECK_TYPE', 'NECK_SIZE', 'PLACKET', 'FATHER_BELT',
                                      'BELT_DESIGN', 'BLT_SIZE', 'SLEEVE', 'BTM_FOLD', 'BOTTOM_OPEN_WIDTH_INC',
                                      'SET', 'FO_STYLE', 'POCKET_TYPE', 'NO_OF_POCKET', 'FIT',
                                      'PATTERN', 'LENGTH', 'MEASUREMENT_LENGTH_INCH', 'DRAWCORD',
                                      'DRAWCORD_STYLE', 'DRAWCORD_LOOP', 'BUTTON', 'BUTTON_COLOR',
                                      'ZIP', 'ZIP_COL', 'PRINT_TYPE', 'PRINT_PLACEMENT', 'PRINT_STYLE',
                                      'PATCHES', 'PATCH_TYPE', 'EMBROIDERY', 'EMB_TYPE', 'PLACEMENT',
                                      'ADD_ACC1', 'WASH', 'WASH_COLOR', 'CLR', 'SIZE', 'MRP',
                                      'ARTICLE_TYPE', 'BUYING_TYPE', 'PD', 'MC_ST'
                                    ].includes(col.name);
                                    
                                    if (isDynamicField) {
                                      // Check if we have data or if it's still loading
                                      const hasData = dynamicDropdowns[col.name] && dynamicDropdowns[col.name].length > 0;
                                      const isLoading = dynamicDropdownsLoading || (!hasData && !dynamicDropdowns.hasOwnProperty(col.name));
                                      
                                      if (isLoading) {
                                        return (
                                          <option value="" disabled>
                                            Loading {col.name}...
                                          </option>
                                        );
                                      } else if (!hasData) {
                                        return (
                                          <option value="" disabled>
                                            No data for {col.name}
                                          </option>
                                        );
                                      }
                                    }
                                  }
                                  
                                  // Convert the raw data to dropdown options
                                  const dropdownOptions = createDropdownOptionsFromCandidates(options, [
                                    ['value', 'label'],
                                    ['id', 'label'],
                                    ['fG_SegId', 'fG_SegName'],
                                    ['fG_DivId', 'fG_DivName'],
                                    ['subDivId', 'subDivName'],
                                    ['majorCatId', 'majorCategoryName'],
                                    ['mcCodeId', 'mc_Code'],
                                    ['mcId', 'mC_DESC']
                                  ]);
                                  
                                  // Safety check to ensure dropdownOptions is an array
                                  if (!Array.isArray(dropdownOptions)) {
  
                                    return null;
                                  }
                                  
                                  return dropdownOptions.map((option, optionIdx) => (
                                    <option key={`${option.value}-${optionIdx}`} value={option.value}>
                                      {option.label}
                                    </option>
                                  ));
                                })()}
                              </select>
                            )}
                          </td>
                        ))}
                        <td className="bg-white" style={{
                          borderColor: '#d1d5db',
                          border: '1px solid #d1d5db',
                          position: 'sticky',
                          right: 0,
                          zIndex: 1,
                          borderLeft: '2px solid #d1d5db',
                          borderRight: '1px solid #d1d5db',
                          width: '60px',
                          textAlign: 'center',
                          verticalAlign: 'middle',
                          padding: '6px 4px'
                        }}>
                          <button
                            className="modern-action-btn modern-action-btn-delete bg-red-500"
                            onClick={() => removeRow(rowIdx)}
                            disabled={rows.length === 1 || readOnly}
                            title="Remove Row"
                            style={{
                              width: '24px',
                              height: '24px',
                              padding: '0',
                              margin: '0 auto',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '12px'
                            }}
                          >
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Fixed buttons outside the scrollable content */}
          <div style={{
            background: '#ffffff',
            padding: '0.5rem 1rem',
            borderTop: '1px solid #e5e7eb',
            display: 'flex',
            gap: '0.5rem',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexShrink: 0
          }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>
                {rows.length} row{rows.length !== 1 ? 's' : ''} total
              </div>
            </div>
          </div>
        </div>
      </div>
        ) : rowData ? (() => {
    // Normalize Images field to always be an array
    let imagesArr = [];
    if (rowData && rowData["Images"]) {
      if (Array.isArray(rowData["Images"])) {
        imagesArr = rowData["Images"];
      } else if (typeof rowData["Images"] === "string" && rowData["Images"].trim() !== "") {
        try {
          const parsed = JSON.parse(rowData["Images"]);
          if (Array.isArray(parsed)) {
            imagesArr = parsed;
          } else {
            imagesArr = [rowData["Images"]];
          }
        } catch {
          imagesArr = rowData["Images"].split(",").map(s => s.trim()).filter(Boolean);
        }
      }
    }
    // Filter for valid image strings (base64 or http)
    imagesArr = imagesArr.filter(img =>
      typeof img === "string" &&
      img.trim() !== "" &&
      (img.startsWith("data:image") || img.startsWith("http"))
    );
    // Debug: log the images array
    if (imagesArr.length > 0) {
      
    }
    // Debug: log the rowData to see what fields are available
    
    
    // Render Row Details: Redesigned attractive card-style modal
    return (
              <div className="apv-modal-overlay" style={{ animation: 'fadeIn 0.3s' }}>
        <div className="apv-modal-content apv-attractive" style={{
          maxWidth: 1100,
          width: '98vw',
          background: '#ffffff',
          padding: 0,
          borderRadius: 22,
          overflow: 'hidden',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.15)',
          animation: 'slideUp 0.4s'
        }}>
          <div style={{
            background: 'linear-gradient(132deg, rgb(251, 251, 255) 0.00%, rgb(215, 223, 252) 100.00%)',
            padding: '2rem 2.5rem 1.5rem 2.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderRadius: '24px 24px 0 0',
            boxShadow: '0 8px 25px rgba(215, 223, 252, 0.3)'
          }}>
            <h2 style={{ color: '#1e3a8a', fontWeight: 800, margin: 0, letterSpacing: 1.2, fontSize: 32, textShadow: '0 2px 4px rgba(30, 58, 138, 0.1)' }}>Article Parcel Details</h2>
            <button className="apv-modal-close" onClick={stableHandleClose} style={{
              background: 'rgba(255,255,255,0.18)',
              border: 'none',
              fontSize: '2.2rem',
              color: '#fff',
              cursor: 'pointer',
              marginLeft: '1rem',
              borderRadius: '50%',
              width: 44,
              height: 44,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.2s',
            }} title="Close">&times;</button>
          </div>
          {/* Summary bar with icons */}
          <div style={{
            display: 'flex',
            gap: '2.5rem',
            margin: '1.7rem 2.5rem 1.3rem 2.5rem',
            flexWrap: 'wrap',
            fontSize: 17,
            justifyContent: 'flex-start',
            alignItems: 'center',
            background: 'linear-gradient(90deg, #f8fafc 0%, #f1f5f9 100%)',
            borderRadius: 12,
            padding: '1.1rem 1.5rem',
            boxShadow: '0 2px 8px rgba(139,92,246,0.1)',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <FaUser style={{ color: '#3b82f6', fontSize: 20 }} />
              <span style={{ fontWeight: 700, color: '#1e3a8a' }}>Vendor Code:</span>&nbsp;<span style={{ color: '#1e3a8a' }}>{rowData['VND_CD'] || 'N/A'}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <FaBoxOpen style={{ color: '#3b82f6', fontSize: 20 }} />
              <span style={{ fontWeight: 700, color: '#1e3a8a' }}>Article Description:</span>&nbsp;<span style={{ color: '#1e3a8a' }}>{rowData['ARTICLE_DESCRIPTION'] || 'N/A'}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <FaBarcode style={{ color: '#3b82f6', fontSize: 20 }} />
                                      <span style={{ fontWeight: 700, color: '#1e3a8a' }}>MC Code:</span>&nbsp;<span style={{ color: '#1e3a8a' }}>{rowData['MC_CD'] || 'N/A'}</span>
            </div>
          </div>
          {/* Details grid with cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '18px',
            maxHeight: '52vh',
            overflowY: 'auto',
            padding: '0 2.5rem 2.2rem 2.5rem',
            background: '#f9fafb'
          }}>
                                    {safeColumnDefinitions.filter(col => !['VND_CD', 'MC_DESC', 'MC_CD'].includes(col.name)).map((col, idx) => (
              <div key={`${col.name}-${idx}`} style={{
                background: '#f1f5fd',
                borderRadius: 10,
                boxShadow: '0 1px 6px rgba(139,92,246,0.1)',
                marginBottom: 0,
                padding: '14px 18px',
                minWidth: 0,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'flex-start',
                border: '1px solid #d1d5db',
                transition: 'box-shadow 0.2s',
                fontSize: 15
              }}>
                <div style={{ fontWeight: 600, color: '#8b5cf6', marginBottom: 4, fontSize: 15, letterSpacing: 0.2 }}>{col.name}</div>
                {col.name === "Images" ? (
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
                    {(() => {
                      let imagesArr = [];
                      if (rowData[col.name]) {
                        if (Array.isArray(rowData[col.name])) {
                          imagesArr = rowData[col.name]
                            .filter(img => img && img !== 'null' && img !== 'undefined' && img !== '' && (typeof img === 'string' && img.trim() !== ''))
                            .map(img => handleArticleFilesUrl(img));
                        } else if (typeof rowData[col.name] === 'string') {
                          imagesArr = rowData[col.name].split(/[\s,;]+/).map(url => url.trim()).filter(Boolean).map(img => handleArticleFilesUrl(img));
                        }
                      }
                      
                      return imagesArr.length > 0 ? (
                        imagesArr.map((img, i) => (
                          <img
                            key={`img-${i}-${img.substring(0, 10)}`}
                            src={img}
                            alt={`Article Image ${i + 1}`}
                            style={{
                              width: 50,
                              height: 50,
                              objectFit: 'cover',
                              borderRadius: 4,
                              border: '1px solid #e5e7eb',
                              backgroundColor: '#f9fafb'
                            }}
                            onError={(e) => {
                      
                              e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2Y5ZmFmYiIvPjx0ZXh0IHg9IjUwIiB5PSI1MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEwIiBmaWxsPSIjNmI3MjgwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+Tm8gSW1hZ2U8L3RleHQ+PC9zdmc+';
                            }}
                            onLoad={() => {
                      
                            }}
                          />
                        ))
                      ) : (
                        <div style={{ color: '#9ca3af', fontStyle: 'italic', fontSize: 12 }}>No images available</div>
                      );
                    })()}
                  </div>
                ) : (
                  <div style={{ color: '#1e3a8a', fontWeight: 500, wordBreak: 'break-word', fontSize: 13 }}>{rowData[col.name]}</div>
                )}
              </div>
            ))}
          </div>
          {imagesArr.length > 0 ? (
            <div style={{ margin: '1.5rem' }}>
              <div style={{ fontWeight: 600, color: '#8b5cf6', marginBottom: 6, fontSize: 16 }}>Images</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {imagesArr.map((img, i) => (
                  <img
                    key={`img-${i}-${img.substring(0, 10)}`}
                    src={img}
                    alt="img"
                    style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 4, border: '1px solid #e5e7eb' }}
                    onError={(e) => { 
                      e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2Y5ZmFmYiIvPjx0ZXh0IHg9IjUwIiB5PSI1MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEwIiBmaWxsPSIjNmI3MjgwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+Tm8gSW1hZ2U8L3RleHQ+PC9zdmc+'; 
                    }}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div style={{ margin: '1.5rem', color: '#9ca3af', fontStyle: 'italic', fontSize: 12 }}>No images available</div>
          )}
          {/* Animations */}
          <style>{`
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            @keyframes slideUp {
              from { transform: translateY(40px); opacity: 0; }
              to { transform: translateY(0); opacity: 1; }
            }
          `}</style>
          {/* Demo Mode Indicator */}
          <div style={{
            background: 'linear-gradient(90deg, #fef3c7 0%, #fde68a 100%)',
            border: '2px solid #f59e0b',
            borderRadius: '8px',
            padding: '12px 20px',
            margin: '0 2.5rem 1rem 2.5rem',
            textAlign: 'center',
            color: '#92400e',
            fontWeight: 'bold',
            fontSize: '16px'
          }}>
            🎭 DEMO MODE - All data is dummy/frontend-only. No backend API calls.
          </div>
          {/* Demo Controls */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '15px', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{
              background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
              border: '1px solid #d1d5db',
              borderRadius: '20px',
              padding: '8px 16px',
              fontSize: '14px',
              fontWeight: '600',
              color: '#374151'
            }}>
              📊 Rows: {rows.length}
            </div>
            <button
              type="button"
              onClick={addDemoRow}
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '20px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              ➕ Add Demo Row
            </button>
            <button
              type="button"
              onClick={resetDemoData}
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '20px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              🔄 Reset Demo Data
            </button>
          </div>
          {/* Demo Info */}
          <div style={{
            background: 'linear-gradient(90deg, #ecfdf5 0%, #d1fae5 100%)',
            border: '2px solid #10b981',
            borderRadius: '8px',
            padding: '15px 20px',
            margin: '0 2.5rem 1rem 2.5rem',
            color: '#065f46',
            fontSize: '14px'
          }}>
            <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>✅ Demo Features Working:</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <div>• Cascading Dropdowns (FG_SEG → FG_DIV → SUB_DIV → MJ_CAT → MC_CD → MC_DESC)</div>
              <div>• Dynamic Dropdowns (MACRO_MVGR, MICRO_MVGR, FAB_DIV, YARN_01, YARN_02)</div>
              <div>• Insert Article (Save Button)</div>
              <div>• Save as Draft</div>
              <div>• Excel Upload</div>
              <div>• JSON Input</div>
              <div>• Image Upload</div>
              <div>• Form Validation</div>
            </div>
          </div>
        </div>
      </div>
        )})() : null}
    </>
    );
};

export default ArticleParcelViewModal;
