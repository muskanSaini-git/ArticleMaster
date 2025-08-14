import React, { useState, useEffect, Fragment } from "react";
import * as XLSX from "xlsx";
import axios from "axios";
import { FiEye, FiTrash, FiEdit, FiPlay, FiSearch, FiDownload, FiUpload, FiPlus, FiPackage, FiClock, FiRefreshCw, FiList } from "react-icons/fi";
import ArticleParcelViewModal from "./ArticleParcelViewModal.jsx";
import { FaCheckCircle, FaTimesCircle, FaHourglassHalf, FaInfoCircle, FaEye, FaEdit, FaTrash } from "react-icons/fa";
import "./ArticalParcel.css";
import config from "../config";
import { sendArticlesForApproval } from "../api/articleApi";
import approvalService from "../api/approvalService";

const TABS = [
  { key: 1, label: "All Articles", color: "text-primary" },
  { key: 2, label: "Pending", color: "text-warning" },
  { key: 3, label: "Approved", color: "text-success" },
  { key: 4, label: "Rejected", color: "text-danger" },
  { key: 5, label: "Draft", color: "text-info" },
  { key: 6, label: "Sent", color: "text-info" },
  { key: 7, label: "Deleted", color: "text-secondary" },
];

// Role-based tabs for Article Creation role
const ARTICLE_CREATION_TABS = [
  { key: 1, label: "Articles", color: "text-primary" },
  { key: 2, label: "Pending Article", color: "text-warning" },
  { key: 3, label: "Approve Article", color: "text-success" },
  { key: 4, label: "Rejected Article", color: "text-danger" },
];

// Get tabs based on user role
const getTabsForRole = (userRole) => {
  if (userRole === 'article_creation') {
    return ARTICLE_CREATION_TABS;
  }
  return TABS;
};

// Updated column names to match backend payload field names exactly
const columnNames = [
  "ART_CR_DATE", "FG_SEG", "FG_DIV", "SUB_DIV", "MJ_CAT", "MC_DESC", "MC_ST", "MC_CD", "GEN_ART", "MC_DESC", "MC_DESC", "HSN_CODE", "VND_CD", "VND_NM", "VND_DZN_NO", "MRP", "NOA", "RNG_SEG", "MAIN_MVGR", "MACRO_MVGR", "MICRO_MVGR", "FAB_DIV", "WEAVE", "WEAVE_2", "COMPOSITION", "FINISH", "CONSTRUCTION", "GSM", "WIDTH", "WIDTH_UOM", "COUNT", "WEIGHT_TYPE", "ORIGINAL_MATERIAL_SOURCE", "SHADE", "LCR_NON_LCR", "NECK", "NECK_TYPE", "NECK_SIZE", "PLACKET", "FATHER_BELT", "BELT_DESIGN", "BLT_SIZE", "SLEEVE", "SLEEVES_MAIN_STYLE", "BTFOLD", "BOTTOM_OPEN_WIDTH_INC", "SET", "FO_STYLE", "POCKET_TYPE", "NO_OF_POCKET", "FIT", "PATTERN", "LENGTH", "MEASUREMENT_LENGTH_INCH", "DRAWCORD", "DRAWCORD_STYLE", "DRAWCORD_LOOP", "BUTTON", "BUTTON_COLOR", "ZIP", "ZIP_COL", "PRINT_TYPE", "PRINT_PLACEMENT", "PRINT_STYLE", "PATCHES", "PATCH_TYPE", "EMBROIDERY", "EMB_TYPE", "PLACEMENT", "ADD_ACC1", "WASH", "WASH_COLOR", "CLR", "SIZE", "SEG", "ARTICLE_TYPE", "BUYING_TYPE", "PD", "OUNZ", "FAB_WEAVE", "FAB2", "FAB_WEAVE_2", "FAB_STYLE", "FAB_SUB_STYLE", "LYCRA", "COLLAR", "NECK_BAND_STYLE", "COLLAR_SIZE", "PLACKET_CHANGING", "BLT_MAIN_STYLE", "SUB_STYLE_BLT", "NECK_BAND", "FO_BTN_STYLE", "POCKET", "MAIN_STYLE", "DC_SUB_STYLE", "DC_EDGE_LOOP", "BTN_MAIN_MVGR", "SUB_STYLE_BTN_CLR", "ADD_ACC", "ACC_COL", "BRAND_VENDOR", "MDM_REMARKS", "DATE", "COLOR1", "SEASON", "SOURCE", "FILE_PATH", "Images"
];

// Function to convert field names to readable headers
const getReadableHeader = (fieldName) => {
  const headerMap = {
    'ART_CR_DATE': 'Article Creation Date',
    'FG_SEG': 'Fabric Segment',
    'FG_DIV': 'Fabric Division',
    'SUB_DIV': 'Sub Division',
    'MJ_CAT': 'Major Category',
    'MC_DESC': 'Material Code Description',
    'MC_ST': 'Material Code Style',
    'MC_CD': 'Material Code',
    'GEN_ART': 'General Article',
    'HSN_CODE': 'HSN Code',
    'VND_CD': 'Vendor Code',
    'VND_NM': 'Vendor Name',
    'VND_DZN_NO': 'Vendor Dozen Number',
    'MRP': 'Maximum Retail Price',
    'NOA': 'Number of Articles',
    'RNG_SEG': 'Range Segment',
    'MAIN_MVGR': 'Main MVGR',
    'MACRO_MVGR': 'Macro MVGR',
    'MICRO_MVGR': 'Micro MVGR',
    'FAB_DIV': 'Fabric Division',
    'WEAVE': 'Weave Type',
    'WEAVE_2': 'Weave Type 2',
    'COMPOSITION': 'Material Composition',
    'FINISH': 'Fabric Finish',
    'CONSTRUCTION': 'Fabric Construction',
    'YARN_01': 'Yarn Type 1',
    'YARN_02': 'Yarn Type 2',
    'GSM': 'Grams per Square Meter',
    'WIDTH': 'Fabric Width',
    'WIDTH_UOM': 'Width Unit of Measure',
    'COUNT': 'Yarn Count',
    'WEIGHT_TYPE': 'Weight Type',
    'ORIGINAL_MATERIAL_SOURCE': 'Original Material Source',
    'SHADE': 'Color Shade',
    'LCR_NON_LCR': 'LCR Non LCR',
    'NECK': 'Neck Style',
    'NECK_TYPE': 'Neck Type',
    'NECK_SIZE': 'Neck Size',
    'PLACKET': 'Placket Style',
    'FATHER_BELT': 'Father Belt',
    'BELT_DESIGN': 'Belt Design',
    'BLT_SIZE': 'Belt Size',
    'SLEEVE': 'Sleeve Style',
    'SLEEVES_MAIN_STYLE': 'Sleeves Main Style',
    'BTFOLD': 'Bottom Fold',
    'BOTTOM_OPEN_WIDTH_INC': 'Bottom Open Width Increase',
    'SET': 'Set Type',
    'FO_STYLE': 'Front Opening Style',
    'POCKET_TYPE': 'Pocket Type',
    'NO_OF_POCKET': 'Number of Pockets',
    'FIT': 'Fit Type',
    'PATTERN': 'Pattern Style',
    'LENGTH': 'Length',
    'MEASUREMENT_LENGTH_INCH': 'Measurement Length in Inches',
    'DRAWCORD': 'Drawcord',
    'DRAWCORD_STYLE': 'Drawcord Style',
    'DRAWCORD_LOOP': 'Drawcord Loop',
    'BUTTON': 'Button Style',
    'BUTTON_COLOR': 'Button Color',
    'ZIP': 'Zipper Style',
    'ZIP_COL': 'Zipper Color',
    'PRINT_TYPE': 'Print Type',
    'PRINT_PLACEMENT': 'Print Placement',
    'PRINT_STYLE': 'Print Style',
    'PATCHES': 'Patches',
    'PATCH_TYPE': 'Patch Type',
    'EMBROIDERY': 'Embroidery',
    'EMB_TYPE': 'Embroidery Type',
    'PLACEMENT': 'Placement',
    'ADD_ACC1': 'Additional Accessory 1',
    'WASH': 'Wash Type',
    'WASH_COLOR': 'Wash Color',
    'CLR': 'Color',
    'SIZE': 'Size',
    'SEG': 'Segment',
    'ARTICLE_TYPE': 'Article Type',
    'BUYING_TYPE': 'Buying Type',
    'PD': 'Product Description',
    'OUNZ': 'Ounces',
    'FAB_WEAVE': 'Fabric Weave',
    'FAB2': 'Fabric 2',
    'FAB_WEAVE_2': 'Fabric Weave 2',
    'FAB_STYLE': 'Fabric Style',
    'FAB_SUB_STYLE': 'Fabric Sub Style',
    'LYCRA': 'Lycra Content',
    'COLLAR': 'Collar Style',
    'NECK_BAND_STYLE': 'Neck Band Style',
    'COLLAR_SIZE': 'Collar Size',
    'PLACKET_CHANGING': 'Placket Changing',
    'BLT_MAIN_STYLE': 'Belt Main Style',
    'SUB_STYLE_BLT': 'Sub Style Belt',
    'NECK_BAND': 'Neck Band',
    'FO_BTN_STYLE': 'Front Opening Button Style',
    'POCKET': 'Pocket',
    'MAIN_STYLE': 'Main Style'
  };
  
  return headerMap[fieldName] || fieldName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

// Column definitions with data types - Updated to match backend payload field names exactly
const columnDefinitions = [
  { name: "ART_CR_DATE", type: "date" },
  { name: "FG_SEG", type: "dropdown" },
  { name: "FG_DIV", type: "dropdown" },
  { name: "SUB_DIV", type: "dropdown" },
  { name: "MJ_CAT", type: "dropdown" },
  { name: "MC_DESC", type: "dropdown" },
  { name: "MC_ST", type: "dropdown" },
  { name: "MC_CD", type: "text" },
  { name: "GEN_ART", type: "text" },
  { name: "MC_DESC", type: "text" },
  { name: "MC_DESC", type: "text" },
  { name: "HSN_CODE", type: "text" },
  { name: "VND_CD", type: "text" },
  { name: "VND_NM", type: "text" },
  { name: "VND_DZN_NO", type: "text" },
  { name: "MRP", type: "number" },
  { name: "NOA", type: "number" },
  { name: "RNG_SEG", type: "text" },
  { name: "MAIN_MVGR", type: "text" },
  { name: "MACRO_MVGR", type: "text" },
  { name: "MICRO_MVGR", type: "text" },
  { name: "FAB_DIV", type: "text" },
  { name: "WEAVE", type: "text" },
  { name: "WEAVE_2", type: "text" },
  { name: "COMPOSITION", type: "text" },
  { name: "FINISH", type: "text" },
  { name: "CONSTRUCTION", type: "text" },
  { name: "YARN_01", type: "dropdown" },
  { name: "YARN_02", type: "dropdown" },
  { name: "GSM", type: "number" },
  { name: "WIDTH", type: "number" },
  { name: "WIDTH_UOM", type: "text" },
  { name: "COUNT", type: "number" },
  { name: "WEIGHT_TYPE", type: "text" },
  { name: "ORIGINAL_MATERIAL_SOURCE", type: "text" },
  { name: "SHADE", type: "text" },
  { name: "LCR_NON_LCR", type: "text" },
  { name: "NECK", type: "text" },
  { name: "NECK_TYPE", type: "text" },
  { name: "NECK_SIZE", type: "text" },
  { name: "PLACKET", type: "text" },
  { name: "FATHER_BELT", type: "text" },
  { name: "BELT_DESIGN", type: "text" },
  { name: "BLT_SIZE", type: "text" },
  { name: "SLEEVE", type: "text" },
  { name: "SLEEVES_MAIN_STYLE", type: "text" },
  { name: "BTFOLD", type: "text" },
  { name: "BOTTOM_OPEN_WIDTH_INC", type: "number" },
  { name: "SET", type: "text" },
  { name: "FO_STYLE", type: "text" },
  { name: "POCKET_TYPE", type: "text" },
  { name: "NO_OF_POCKET", type: "number" },
  { name: "FIT", type: "text" },
  { name: "PATTERN", type: "text" },
  { name: "LENGTH", type: "text" },
  { name: "MEASUREMENT_LENGTH_INCH", type: "number" },
  { name: "DRAWCORD", type: "text" },
  { name: "DRAWCORD_STYLE", type: "text" },
  { name: "DRAWCORD_LOOP", type: "text" },
  { name: "BUTTON", type: "text" },
  { name: "BUTTON_COLOR", type: "text" },
  { name: "ZIP", type: "text" },
  { name: "ZIP_COL", type: "text" },
  { name: "PRINT_TYPE", type: "text" },
  { name: "PRINT_PLACEMENT", type: "text" },
  { name: "PRINT_STYLE", type: "text" },
  { name: "PATCHES", type: "text" },
  { name: "PATCH_TYPE", type: "text" },
  { name: "EMBROIDERY", type: "text" },
  { name: "EMB_TYPE", type: "text" },
  { name: "PLACEMENT", type: "text" },
  { name: "ADD_ACC1", type: "text" },
  { name: "WASH", type: "text" },
  { name: "WASH_COLOR", type: "text" },
  { name: "CLR", type: "text" },
  { name: "SIZE", type: "text" },
  { name: "MRP", type: "number" },
  { name: "SEG", type: "text" },
  { name: "ARTICLE_TYPE", type: "text" },
  { name: "BUYING_TYPE", type: "text" },
  { name: "PD", type: "text" },
  { name: "OUNZ", type: "number" },
  { name: "FAB_WEAVE", type: "text" },
  { name: "FAB2", type: "text" },
  { name: "FAB_WEAVE_2", type: "text" },
  { name: "FAB_STYLE", type: "text" },
  { name: "FAB_SUB_STYLE", type: "text" },
  { name: "LYCRA", type: "text" },
  { name: "COLLAR", type: "text" },
  { name: "NECK_BAND_STYLE", type: "text" },
  { name: "COLLAR_SIZE", type: "text" },
  { name: "PLACKET_CHANGING", type: "text" },
  { name: "BLT_MAIN_STYLE", type: "text" },
  { name: "SUB_STYLE_BLT", type: "text" },
  { name: "NECK_BAND", type: "text" },
  { name: "FO_BTN_STYLE", type: "text" },
  { name: "POCKET", type: "text" },
  { name: "MAIN_STYLE", type: "text" },
  { name: "DC_SUB_STYLE", type: "text" },
  { name: "DC_EDGE_LOOP", type: "text" },
  { name: "BTN_MAIN_MVGR", type: "text" },
  { name: "SUB_STYLE_BTN_CLR", type: "text" },
  { name: "ADD_ACC", type: "text" },
  { name: "ACC_COL", type: "text" },
  { name: "BRAND_VENDOR", type: "text" },
  { name: "MDM_REMARKS", type: "text" },
  { name: "DATE", type: "date" },
  { name: "COLOR1", type: "text" },
  { name: "SIZE", type: "text" },
  { name: "SEASON", type: "text" },
  { name: "SOURCE", type: "text" },
  { name: "FILE_PATH", type: "text" },
  { name: "Images", type: "images" }
];

// Main table columns - Show 7 essential columns including Images and STATUS
const mainTableColumns = [
  "MC_CD",
  "FG_SEG", 
  "FG_DIV",
  "MJ_CAT",
  "MC_DESC",
  "STATUS",
  "Images"
];

// Deleted table columns - Include deletion date
const deletedTableColumns = [
  "MC_CD",
  "FG_SEG", 
  "FG_DIV",
  "MJ_CAT",
  "MC_DESC",
  "deletedAt",
  "Images"
];

// All columns for modal view
const allColumns = [
  "MC_CD",
  "FG_SEG", 
  "FG_DIV",
  "MJ_CAT",
  "MC_DESC",
  "VND_CD",
  "VND_NM",
  "MRP",
  "NOA",
  "STATUS",
  "Images"
];

// Generate placeholder data for demonstration
const generateRow = (id, status) => {
  const row = { STATUS: status };
  columnNames.forEach((col, idx) => {
    if (col === "STATUS") row[col] = status;
    else if (col.includes("DATE")) row[col] = `2024-07-23`;
    else if (col.includes("QTY") || col.includes("PRICE") || col.includes("%") || col === "Color1" || col === "Size" || col === "Season" || col === "Source" || col === "Unnamed: 77") row[col] = Math.floor(Math.random() * 100);
    else if (col === "Images") row[col] = []; // Empty array for images - will show "Add" placeholder
    else row[col] = `${col} ${id}`;
  });
  return row;
};

  // Handler for individual article approval
  

const statusBadge = (status) => {
  if (!status) return null;
  const s = status.toLowerCase();
    if (s.includes("pending")) return <span className="modern-status-badge modern-status-pending" style={{color: 'black'}}>Pending</span>;
    if (s.includes("approved")) return <span className="modern-status-badge modern-status-approved" style={{color: 'black'}}>Approved</span>;
    if (s.includes("reject")) return <span className="modern-status-badge modern-status-rejected" style={{color: 'black'}}>Rejected</span>;
    if (s.includes("sent for approval")) return <span className="modern-status-badge modern-status-sent" style={{color: 'black'}}>Sent for Approval</span>;
    if (s.includes("sent")) return <span className="modern-status-badge modern-status-sent" style={{color: 'black'}}>Sent</span>;
  return <span className="modern-status-badge modern-status-pending" style={{color: 'black'}}>{status}</span>;
};

// Mapping from frontend to backend field names
const frontendToBackendMap = {
  "ART CR DATE": "arT_CR_DATE",
  "SEG": "seg",
  "DIV": "div",
  "SUB_DIV": "suB_DIV",
  "MAJ_CAT_NM": "maJ_CAT_NM",
  "MC_DESC": "mC_DESC",
  "MC_ST": "mC_ST",
  "MC_CODE": "mC_CODE",
  "GEN_ART": "geN_ART",
  "ARTICLE_DESCRIPTION_LONG": "articlE_DESCRIPTION_LONG",
  "ARTICLE_DESCRIPTION": "articlE_DESCRIPTION",
  "HSN_CODE": "hsN_CODE",
  "VND_CD": "vnD_CD",
  "VND_NM": "vnD_NM",
  "VND_DZN_NO": "vnD_DZN_NO",
  "MRP": "mrp",
  "NOA": "noa",
  "RNG_SEG": "rnG_SEG",
  "MAIN_MVGR": "maiN_MVGR",
  "MACRO_MVGR": "macrO_MVGR",
  "MICRO_MVGR": "micrO_MVGR",
  "FAB_DIV": "faB_DIV",
  "WEAVE": "weave",
  "WEAVE_2": "weave2",
  "YARN": "yarn",
  "FAB_WEAVE": "faB_WEAVE",
  "FAB2": "faB2",
  "FAB_WEAVE_2": "faB_WEAVE_2",
  "FAB_STYLE": "faB_STYLE",
  "FAB_SUB_STYLE": "faB_SUB_STYLE",
  "SHADE": "shade",
  "LYCRA": "lycra",
  "GSM": "gsm",
  "COUNT": "count",
  "OUNZ": "ounz",
  "FAB_WEIGHT": "faB_WEIGHT",
  "COLLAR": "collar",
  "NECK_BAND_STYLE": "necK_BAND_STYLE",
  "COLLAR_SIZE": "collaR_SIZE",
  "PLACKET_CHANGING": "plackeT_CHANGING",
  "BLT_MAIN_STYLE": "blT_MAIN_STYLE",
  "SUB_STYLE_BLT": "suB_STYLE_BLT",
  "BLT_SIZE": "blT_SIZE",
  "SLEEVES_MAIN_STYLE": "sleeveS_MAIN_STYLE",
  "BTFOLD": "btfold",
  "SET": "set",
  "NECK_BAND": "necK_BAND",
  "FO_BTN_STYLE": "fO_BTN_STYLE",
  "POCKET": "pocket",
  "FIT": "fit",
  "PATTERN": "pattern",
  "LENGTH": "length",
  "MAIN_STYLE": "maiN_STYLE",
  "DC_SUB_STYLE": "dC_SUB_STYLE",
  "DC_EDGE_LOOP": "dC_EDGE_LOOP",
  "BTN_MAIN_MVGR": "btN_MAIN_MVGR",
  "SUB_STYLE_BTN_CLR": "ButtonColor",
  "ZIP": "zip",
  "ZIP_COL": "ziP_COL",
  "ADD_ACC": "adD_ACC",
  "ACC_COL": "acC_COL",
  "PRINT_TYPE": "prinT_TYPE",
  "PRINT_PLACEMENT": "prinT_PLACEMENT",
  "PRINT_STYLE": "prinT_STYLE",
  "PATCHES": "patches",
  "PATCH_TYPE": "patcH_TYPE",
  "EMBROIDERY": "embroidery",
  "EMB_TYPE": "emB_TYPE",
  "PLACEMENT": "placement",
  "ADD_ACC1": "adD_ACC1",
  "WASH": "wash",
  "WASH_COLOR": "wasH_COLOR",
  "BUYING_TYPE": "buyinG_TYPE",
  "PD": "pd",
  "BRAND_VENDOR": "branD_VENDOR",
  "MDM_REMARKS": "mdM_REMARKS",
  "DATE": "date",
  "COLOR1": "coloR1",
  "SIZE": "size",
  "SEASON": "season",
  "SOURCE": "source",
  "Images": "images"
  // Add any other mappings as needed
};

function mapFrontendToBackend(row) {
  const mapped = {};
  for (const [frontendKey, backendKey] of Object.entries(frontendToBackendMap)) {
    if (row[frontendKey] !== undefined) {
      mapped[backendKey] = row[frontendKey];
    }
  }
  // Add ArticleId and updatedBy if present
  if (row.ArticleId !== undefined) mapped.ArticleId = row.ArticleId;
  if (row.updatedBy !== undefined) mapped.updatedBy = row.updatedBy;
  return mapped;
}

const ArticleParcel = ({ userRole, currentTab = 1 }) => {
  console.log('🚀 ArticleParcel component loaded');
  console.log('📍 Current URL:', window.location.pathname);
  console.log('👤 User Role:', userRole);
  console.log('📑 Current Tab:', currentTab);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [articleRows, setArticleRows] = useState([
    // Initial dummy data for demo
    {
      ArticleId: 'MC001',
      MC_CD: '113030110',
      FG_SEG: 'APPAREL',
      FG_DIV: 'KIDS',
      MJ_CAT: 'IB_B_SUIT_FS',
      MC_DESC: 'M_TEES_HS',
      STATUS: 'Pending',
      VND_CD: 'V001',
      VND_NM: 'Demo Vendor 1',
      DATE: new Date().toISOString().split('T')[0],
      ART_CR_DATE: new Date().toISOString().split('T')[0],
      CREATED_BY: 'article_creation',
      Images: []
    },
    {
      ArticleId: 'MC002',
      MC_CD: '113030120',
      FG_SEG: 'FOOTWEAR',
      FG_DIV: 'MEN',
      MJ_CAT: 'IB_B_SHIRT_FS',
      MC_DESC: 'M_SHIRTS_HS',
      STATUS: 'Pending',
      VND_CD: 'V002',
      VND_NM: 'Demo Vendor 2',
      DATE: new Date().toISOString().split('T')[0],
      ART_CR_DATE: new Date().toISOString().split('T')[0],
      CREATED_BY: 'article_creation',
      Images: []
    },
    {
      ArticleId: 'MC003',
      MC_CD: '113030130',
      FG_SEG: 'ACCESSORIES',
      FG_DIV: 'WOMEN',
      MJ_CAT: 'IB_B_DRESS_FS',
      MC_DESC: 'M_DRESSES_HS',
      STATUS: 'Pending',
      VND_CD: 'V003',
      VND_NM: 'Demo Vendor 3',
      DATE: new Date().toISOString().split('T')[0],
      ART_CR_DATE: new Date().toISOString().split('T')[0],
      CREATED_BY: 'article_creation',
      Images: []
    }
  ]); // Only backend data
  const [displayedArticles, setDisplayedArticles] = useState([]);
  const [currentFilter, setCurrentFilter] = useState('all'); // 'all', 'recent', 'updated'
  const [excelModalOpen, setExcelModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [excelViewModalOpen, setExcelViewModalOpen] = useState(false);
  const [excelViewRow, setExcelViewRow] = useState(null);
  const [inputData, setInputData] = useState({
    "Article Number": "",
    "Description": "",
    "Quantity": ""
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [rowToDelete, setRowToDelete] = useState(null);
  const [editingRow, setEditingRow] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [approvalMessage, setApprovalMessage] = useState("");
  const [tableHeaders, setTableHeaders] = useState([]);
  const [imageGalleryModal, setImageGalleryModal] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentTabState, setCurrentTab] = useState(currentTab); // Add missing state variable

  // Dropdown data states moved to ArticleParcelViewModal.jsx
  const [imageErrors, setImageErrors] = useState([]);
  
  // Deleted articles state
  const [deletedArticles, setDeletedArticles] = useState([]);

  // Sync currentTabState with currentTab prop
  useEffect(() => {
    setCurrentTab(currentTab);
  }, [currentTab]);

  // Handler for individual article approval
  const handleIndividualApproval = async (articleId) => {
    try {
      console.log('🔄 Sending individual article for approval:', articleId);
      setApprovalMessage("🔄 Sending article for approval...");
      
      // Use the new approval service with JWT authentication
      const result = await approvalService.sendArticlesForApproval([articleId]);
      console.log('📄 Individual Approval API Result:', result);
      
      // Check if the response indicates success
      if (result.success === true || result.status === true) {
        console.log('✅ Article sent for approval successfully!');
        setApprovalMessage("✅ Article sent for approval successfully!");
        
        // Update the article status to 'Sent for Approval'
      setArticleRows(prevRows => prevRows.map(row =>
          row.ArticleId === articleId ? { ...row, STATUS: 'Sent for Approval' } : row
        ));
        
        // Update displayed articles as well
        setDisplayedArticles(prevDisplayed => prevDisplayed.map(row =>
          row.ArticleId === articleId ? { ...row, STATUS: 'Sent for Approval' } : row
        ));
        
        // Don't refresh data from server - keep local changes
        // await fetchDataByStatus(1);
      } else {
        console.log('⚠️ Individual approval API returned false status:', result);
        setApprovalMessage(`⚠️ Approval failed: ${result.message || 'Unknown error'}`);
      }
      
    } catch (err) {
      console.error('❌ Individual approval error:', err);
      setApprovalMessage("❌ Error sending for approval: " + err.message);
    }
    
    setTimeout(() => {
      setApprovalMessage("");
    }, 5000);
  };

  // Filter articles based on current tab
  const getFilteredArticles = () => {
    let filtered = [];
    
    // Filter by tab
    if (userRole === 'article_creation') {
      // Article Creation role specific filtering
      switch (currentTabState) {
        case 1: // Articles (own created articles only)
          filtered = articleRows.filter(article => {
            // Show articles created by this role or with specific statuses
            const isOwnArticle = article.CREATED_BY === userRole || 
                                article.CREATED_BY === 'article_creation' ||
                                article.CREATED_BY === 'Article Creator' ||
                                article.CREATED_BY === 'article_creator';
            
            // Also show articles with New or Draft status (likely created by this role)
            const isNewOrDraft = article.STATUS === 'New' || 
                                article.STATUS === 'Draft' ||
                                article.STATUS === 'new' ||
                                article.STATUS === 'draft';
            
            const shouldShow = isOwnArticle || isNewOrDraft;
            
            // Debug logging for first few articles
            if (filtered.length < 3) {
              // Debug logging removed
            }
            
            return shouldShow;
          });
          // Debug logging removed
          break;
        case 2: // Pending Article (sent for approval but not approved)
          filtered = articleRows.filter(article => 
            article.STATUS && article.STATUS.toLowerCase().includes('sent for approval')
          );
          break;
        case 3: // Approve Article (show all approved articles from all roles)
          filtered = articleRows.filter(article => 
            article.STATUS && article.STATUS.toLowerCase().includes('approved')
          );
          break;
        case 4: // Rejected Article (show rejected articles)
          filtered = articleRows.filter(article => 
            article.STATUS && article.STATUS.toLowerCase().includes('rejected')
          );
          break;
        default:
          filtered = articleRows.filter(article => {
            const isOwnArticle = article.CREATED_BY === userRole || 
                                article.CREATED_BY === 'article_creation' ||
                                article.CREATED_BY === 'Article Creator' ||
                                article.CREATED_BY === 'article_creator';
            
            const isNewOrDraft = article.STATUS === 'New' || 
                                article.STATUS === 'Draft' ||
                                article.STATUS === 'new' ||
                                article.STATUS === 'draft';
            
            return isOwnArticle || isNewOrDraft;
          });
      }
    } else {
      // Admin role filtering (existing logic)
      switch (currentTabState) {
      case 1: // All active articles
        filtered = articleRows;
        break;
      case 2: // Pending
        filtered = articleRows.filter(article => 
          article.STATUS && article.STATUS.toLowerCase().includes('pending')
        );
        break;
      case 3: // Approved
        filtered = articleRows.filter(article => 
          article.STATUS && article.STATUS.toLowerCase().includes('approved')
        );
        break;
      case 4: // Rejected
        filtered = articleRows.filter(article => 
          article.STATUS && article.STATUS.toLowerCase().includes('rejected')
        );
        break;
      case 5: // Draft articles
        filtered = articleRows.filter(article => 
          article.STATUS && article.STATUS.toLowerCase().includes('draft')
        );
        break;
      case 6: // Sent articles
        filtered = articleRows.filter(article => 
            article.STATUS && (article.STATUS.toLowerCase().includes('sent for approval') || article.STATUS.toLowerCase().includes('sent'))
        );
        break;
      case 7: // Deleted articles
        filtered = deletedArticles;
        break;
      default:
        filtered = articleRows;
      }
    }
    
    // Filter by search query (only for active articles, not deleted ones)
    if (searchQuery && currentTabState !== 7) {
      filtered = filtered.filter(article =>
        Object.values(article).some(value =>
          value && value.toString().toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }
    
    return filtered;
  };

  // Get tab counts
  const getTabCounts = () => {
    if (userRole === 'article_creation') {
      // Article Creation role specific counts
      const articles = articleRows.filter(article => {
        const isOwnArticle = article.CREATED_BY === userRole || 
                            article.CREATED_BY === 'article_creation' ||
                            article.CREATED_BY === 'Article Creator' ||
                            article.CREATED_BY === 'article_creator';
        
        const isNewOrDraft = article.STATUS === 'New' || 
                            article.STATUS === 'Draft' ||
                            article.STATUS === 'new' ||
                            article.STATUS === 'draft';
        
        return isOwnArticle || isNewOrDraft;
      }).length;
      
      const pending = articleRows.filter(article => 
        article.STATUS && article.STATUS.toLowerCase().includes('sent for approval')
      ).length;
      const approved = articleRows.filter(article => 
        article.STATUS && article.STATUS.toLowerCase().includes('approved')
      ).length;
      const rejected = articleRows.filter(article => 
        article.STATUS && article.STATUS.toLowerCase().includes('rejected')
      ).length;
      
      return { articles, pending, approved, rejected };
    } else {
      // Admin role counts (existing logic)
    const all = articleRows.length;
    const pending = articleRows.filter(article => 
      article.STATUS && article.STATUS.toLowerCase().includes('pending')
    ).length;
    const approved = articleRows.filter(article => 
      article.STATUS && article.STATUS.toLowerCase().includes('approved')
    ).length;
    const rejected = articleRows.filter(article => 
      article.STATUS && article.STATUS.toLowerCase().includes('rejected')
    ).length;
    const draft = articleRows.filter(article => 
      article.STATUS && article.STATUS.toLowerCase().includes('draft')
    ).length;
    const sent = articleRows.filter(article => 
        article.STATUS && (article.STATUS.toLowerCase().includes('sent for approval') || article.STATUS.toLowerCase().includes('sent'))
    ).length;
    const deleted = deletedArticles.length;
    
    return { all, pending, approved, rejected, draft, sent, deleted };
    }
  };

  const tabCounts = getTabCounts();
  
  // Clear image errors - COMMENTED OUT FOR NOW
  /*
  const clearImageErrors = () => {
    setImageErrors([]);
  };
  */

  // Test if image URL is accessible - COMMENTED OUT FOR NOW
  /*
  const testImageUrl = async (imageUrl) => {
    try {
      const response = await fetch(imageUrl, { method: 'HEAD' });
      return response.ok;
    } catch (error) {
      console.log(`🖼️ Image URL test failed for ${imageUrl}:`, error.message);
      return false;
    }
  };
  */

  // Handle image loading with better error handling - COMMENTED OUT FOR NOW
  /*
  const handleImageError = (imageUrl, element) => {
    console.log(`🖼️ Image failed to load: ${imageUrl}`);
    
    // Set placeholder image
    element.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBmaWxsPSIjNmI3MjgwIiIvPjx0ZXh0IHg9IjUwIiB5PSI1MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEwIiBmaWxsPSIjNmI3MjgwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+Tm8gSW1hZ2U8L3RleHQ+PC9zdmc+';
    element.style.display = 'block';
    element.title = `Image not found: ${imageUrl}`;
    
    // Extract image name for error tracking
    const imageName = imageUrl.split('/').pop() || 'Unknown';
    
    // Add to error list
    setImageErrors(prev => {
      const newErrors = [...prev, imageName];
      return newErrors.slice(-10); // Keep last 10 errors for better tracking
    });
    
    // Show user-friendly message with more specific information
    if (imageErrors.length === 0) {
      setApprovalMessage(`ℹ️ Some images failed to load (404 errors). This is normal if image files don't exist on the server yet.`);
      setTimeout(() => setApprovalMessage(""), 8000);
    }
  };
  */

  // Preload and validate images to prevent 404 errors - COMMENTED OUT FOR NOW
  /*
  const preloadImage = (imageUrl) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = imageUrl;
    });
  };
  */

  // Batch validate images and show summary - COMMENTED OUT FOR NOW
  /*
  const validateImages = async (imageUrls) => {
    const results = await Promise.all(
      imageUrls.map(url => preloadImage(url))
    );
    
    const failedImages = imageUrls.filter((url, index) => !results[index]);
    
    if (failedImages.length > 0) {
      console.log(`🖼️ ${failedImages.length} images failed validation:`, failedImages);
      setApprovalMessage(`⚠️ ${failedImages.length} images not found on server. This is normal for new articles.`);
      setTimeout(() => setApprovalMessage(""), 6000);
    }
    
    return results;
  };
  */

  // Handle specific 404 errors from ArticleFiles server - COMMENTED OUT FOR NOW
  /*
  const handleArticleFileError = (imageUrl) => {
    // Keep original URLs from backend - don't modify them
    console.log(`🖼️ Image error for: ${imageUrl}`);
      
      // Add to error tracking
      setImageErrors(prev => {
      const newErrors = [...prev, imageUrl];
        return newErrors.slice(-10);
      });
      
    // Show specific message for image errors
      if (imageErrors.length === 0) {
        setApprovalMessage(`ℹ️ Some images not found (normal for new articles)`);
        setTimeout(() => setApprovalMessage(""), 3000);
    }
  };
  */

  // Convert URL image to base64 to avoid 404 errors
  const convertUrlToBase64 = async (imageUrl) => {
    try {
      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const blob = await response.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(new Error('Failed to convert to base64'));
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.log(`🖼️ Failed to convert URL to base64: ${imageUrl}`, error.message);
      return null;
    }
  };

  // Handle ArticleFiles URLs - fix incorrect base URLs from backend
  const handleArticleFilesUrl = (imageUrl) => {
    if (!imageUrl || typeof imageUrl !== 'string') {
      return imageUrl;
    }
    
    // Fix incorrect base URLs from backend
    if (imageUrl.includes('192.168.151.24:9000')) {
      const fixedUrl = imageUrl.replace('192.168.151.24:9000', '192.168.149.188');
      console.log(`🖼️ Fixed image URL: ${imageUrl} -> ${fixedUrl}`);
      return fixedUrl;
    }
    
    // Keep original URLs if they're already correct
    console.log(`🖼️ Using image URL: ${imageUrl}`);
    return imageUrl;
  };

  // Enhanced function to convert URLs to Base64 and handle Base64 images
  const convertArticleImagesToBase64 = async (article) => {
    if (!article.Images || !Array.isArray(article.Images)) {
      return article;
    }

    const convertedImages = [];
    
    for (const image of article.Images) {
      if (typeof image === 'string') {
        if (image.startsWith('data:')) {
          // Already base64 - validate and keep
          convertedImages.push(image);
          console.log(`🖼️ Found existing base64 image: ${image.substring(0, 50)}...`);
        } else if (image.startsWith('http')) {
          // URL - handle old server URLs and try to convert to base64
          const cleanImageUrl = handleArticleFilesUrl(image);
          console.log(`🔄 Converting URL to base64: ${cleanImageUrl}`);
          const base64 = await convertUrlToBase64(cleanImageUrl);
          if (base64) {
            convertedImages.push(base64);
            console.log(`✅ Successfully converted URL to base64: ${image.substring(0, 50)}...`);
          } else {
            // Keep original URL if conversion fails
            console.log(`❌ Failed to convert URL, keeping original: ${image}`);
            convertedImages.push(image);
          }
        } else if (image.length > 100 && !image.includes('http')) {
          // Likely base64 without prefix - add prefix
          const base64WithPrefix = `data:image/jpeg;base64,${image}`;
          convertedImages.push(base64WithPrefix);
          console.log(`🖼️ Added prefix to base64 image: ${image.substring(0, 50)}...`);
        } else {
          // Other string - keep as is
          convertedImages.push(image);
        }
      } else {
        // Non-string - keep as is
        convertedImages.push(image);
      }
    }

    return { ...article, Images: convertedImages };
  };

  // Function to convert all articles' images to Base64
  const convertAllArticlesToBase64 = async (articles) => {
    console.log('🔄 Converting all articles images to Base64...');
    const convertedArticles = [];
    
    for (const article of articles) {
      const convertedArticle = await convertArticleImagesToBase64(article);
      convertedArticles.push(convertedArticle);
    }
    
    console.log(`✅ Converted ${convertedArticles.length} articles to Base64`);
    return convertedArticles;
  };

  // Enhanced function to extract and process images from API response
  const extractImagesFromArticle = (article) => {
    const images = [];
    
    console.log('🔍 Extracting images from article:', article);
    console.log('🔍 Article keys:', Object.keys(article));
    
    // Check multiple possible image fields
    const possibleImageFields = ['Images', 'images', 'Image', 'image', 'FILE_PATH', 'file_path', 'Photo', 'photo'];
    
    for (const field of possibleImageFields) {
      if (article[field]) {
        console.log(`✅ Found image field '${field}':`, article[field]);
        if (Array.isArray(article[field])) {
          images.push(...article[field]);
          console.log(`📦 Added ${article[field].length} images from array field '${field}'`);
        } else if (typeof article[field] === 'string') {
          // Split by common delimiters
          const imageUrls = article[field].split(/[,\s;]+/).filter(url => url && url.trim() && url.trim() !== 'null' && url.trim() !== 'undefined');
          images.push(...imageUrls);
          console.log(`📦 Added ${imageUrls.length} images from string field '${field}':`, imageUrls);
        }
      } else {
        console.log(`❌ Field '${field}' not found or empty`);
      }
    }
    
    // Remove duplicates and clean up
    const uniqueImages = [...new Set(images)].filter(img => img && img.trim());
    
    console.log(`🖼️ Final extracted ${uniqueImages.length} unique images:`, uniqueImages);
    return uniqueImages;
  };

  // Function to fetch images for an article from the API
  const fetchArticleImages = async (articleId) => {
    try {
      const imageApiUrl = `${config.asnBaseUrl}/api/Article/GetArticleImages?articleId=${articleId}`;
      console.log(`🖼️ Fetching images for article ${articleId}:`, imageApiUrl);
      
      const response = await fetch(imageApiUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const result = await response.json();
        if (result.status && result.data) {
          console.log(`✅ Fetched ${result.data.length} images for article ${articleId}:`, result.data);
          return result.data;
        }
      }
      
      console.log(`⚠️ No images found for article ${articleId}`);
      return [];
    } catch (error) {
      console.log(`❌ Error fetching images for article ${articleId}:`, error.message);
      return [];
    }
  };

  // Reusable dropdown component
  const DropdownComponent = ({ 
    options, 
    value, 
    onChange, 
    placeholder, 
    disabled = false,
    loading = false 
  }) => {
    return (
      <select
        className="form-control form-control-sm"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled || loading}
        style={{
          background: !value ? '#fffbe6' : undefined,
          borderColor: !value ? '#ffc107' : undefined
        }}
      >
        <option value="">{loading ? "Loading..." : placeholder}</option>
        {options.map((option, index) => (
          <option key={`${option.value || option.id || index}-${index}`} value={option.value || option.id}>
            {option.label || option.name || option.text}
          </option>
        ))}
      </select>
    );
  };

  // Enhanced function to handle file upload and convert to base64
  const handleFileUpload = async (files) => {
    const base64Images = [];
    
    for (const file of files) {
      if (file.type.startsWith('image/')) {
        try {
          const base64 = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (event) => {
              resolve(event.target.result);
            };
            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsDataURL(file);
          });
          
          base64Images.push(base64);
          console.log(`✅ Converted file to base64: ${file.name}`);
        } catch (error) {
          console.error('Error converting file to base64:', error);
        }
      }
    }
    
    return base64Images;
  };



  // Initialize with backend data - REMOVED to prevent data reset
  // useEffect(() => {
  //   fetchDataByStatus(1);
  //   fetchDropdownData();
  // }, []);

  // Keep dropdown data fetching but don't reset article data
  useEffect(() => {
    fetchDropdownData();
  }, []);



  // Debug editingRow changes
  useEffect(() => {
    // Removed console logs for cleaner output
  }, [editingRow, excelModalOpen]);

  // Dropdown data fetching moved to ArticleParcelViewModal.jsx
  const fetchDropdownData = async () => {
    // This function is now handled in the modal component
    console.log('Dropdown data fetching moved to modal component');
  };
  // Dropdown functions moved to ArticleParcelViewModal.jsx
  const fetchDivisionsBySegment = async (segmentId) => {
    console.log('Dropdown functions moved to modal component');
  };

  // Dropdown functions moved to ArticleParcelViewModal.jsx
  const fetchSubDivisions = async (divisionId) => {
    console.log('Dropdown functions moved to modal component');
  };

  // Dropdown functions moved to ArticleParcelViewModal.jsx
  const fetchMajorCategories = async (subDivId) => {
    console.log('Dropdown functions moved to modal component');
  };



  // Dropdown functions moved to ArticleParcelViewModal.jsx
  const fetchMcstDetails = async (mcId) => {
    console.log('Dropdown functions moved to modal component');
  };

  // Fetch individual article by ID
  const fetchArticleById = async (articleId) => {
    try {
      const response = await fetch(`${config.asnBaseUrl}/api/Article/GetArticleMasterDetailById?id=${articleId}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Backend Error: ${response.status} ${response.statusText}. ${errorText}`);
      }
      
      const result = await response.json();
      
      if (!result.status) {
        throw new Error(result.message || 'Backend returned false status');
      }
      
      return result.data;
      
    } catch (err) {
      throw err;
    }
  };



  // Axios function to get all articles
  const getAllArticlesWithAxios = async () => {
    try {
      const res = await axios.get(`${config.asnBaseUrl}/api/Article/GetAllArticleMasterDetail?pageNumber=1&pageSize=10&searchText=&StatusId=1`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      console.log('Axios GetAll response:', res.data);
      return res.data;
    } catch (error) {
      console.error('Error fetching articles with axios:', error);
      throw error;
    }
  };

  // Test payload structure to match backend expectations
  const testPayloadStructure = () => {
    const testPayload = [
      {
        "ART_CR_DATE": "2025-07-25T10:00:00",
        "SEG": "APP",
        "DIV": "MENS",
        "SUB_DIV": "MS-U",
        "MAJ_CAT_NM": "M_TEES_HS",
        "MC_DESC": "M_TEES_HS",
        "MC_ST": "ACT",
        "MC_CODE": "113030110",
        "GEN_ART": "General Article",
        "ARTICLE_DESCRIPTION_LONG": "This is a long description",
        "ARTICLE_DESCRIPTION": "Short description",
        "HSN_CODE": "HSN6659",
        "VND_CD": "VND001",
        "VND_NM": "Rajiv",
        "VND_DZN_NO": "DZN123",
        "MRP": "100.00",
        "NOA": "10",
        "RNG_SEG": "RangeSegment",
        "MAIN_MVGR": "MainMVGR",
        "MACRO_MVGR": "MacroMVGR",
        "MICRO_MVGR": "MicroMVGR",
        "FAB_DIV": "FabDiv",
        "WEAVE": "WeaveType",
        "WEAVE_2": "WeaveType2",
        "YARN": "YarnType",
        "FAB_WEAVE": "WeaveType",
        "FAB2": "Fab2Value",
        "FAB_WEAVE_2": "WeaveType2",
        "FAB_STYLE": "Style1",
        "FAB_SUB_STYLE": "SubStyle1",
        "SHADE": "Shade1",
        "LYCRA": "Yes",
        "GSM": "150",
        "COUNT": "Count1",
        "OUNZ": "OunceValue",
        "FAB_WEIGHT": "Weight1",
        "COLLAR": "CollarType",
        "NECK_BAND_STYLE": "NeckBandStyle1",
        "COLLAR_SIZE": "Medium",
        "PLACKET_CHANGING": "No",
        "BLT_MAIN_STYLE": "MainStyle1",
        "SUB_STYLE_BLT": "SubStyleBLT",
        "BLT_SIZE": "Size1",
        "SLEEVES_MAIN_STYLE": "SleeveStyle1",
        "BTFOLD": "Fold1",
        "SET": "Set1",
        "NECK_BAND": "Band1",
        "FO_BTN_STYLE": "ButtonStyle1",
        "POCKET": "PocketType",
        "FIT": "Slim",
        "PATTERN": "Pattern1",
        "LENGTH": "Length1",
        "MAIN_STYLE": "MainStyle",
        "DC_SUB_STYLE": "DCSubStyle",
        "DC_EDGE_LOOP": "EdgeLoop1",
        "BTN_MAIN_MVGR": "BtnMainMVGR",
        "SUB_STYLE_BTN_CLR": "ButtonColor",
        "ZIP": "ZipType",
        "ZIP_COL": "ZipColor",
        "ADD_ACC": "Accessory1",
        "ACC_COL": "AccessoryColor",
        "PRINT_TYPE": "PrintType1",
        "PRINT_PLACEMENT": "Front",
        "PRINT_STYLE": "StyleA",
        "PATCHES": "Patch1",
        "PATCH_TYPE": "TypeA",
        "EMBROIDERY": "Embroidery1",
        "EMB_TYPE": "EmbType1",
        "PLACEMENT": "Placement1",
        "ADD_ACC1": "AdditionalAcc1",
        "WASH": "WashType",
        "WASH_COLOR": "Blue",
        "BUYING_TYPE": "Type1",
        "PD": "PDValue",
        "BRAND_VENDOR": "BrandName",
        "MDM_REMARKS": "Remarks",
        "DATE": "2025-07-25T10:00:00",
        "COLOR1": "Red",
        "SIZE": "L",
        "SEASON": "Summer",
        "SOURCE": "Source1",
        "FILE_PATH": "/ArticleFiles/sample1.jpg",
        "Images": [
          "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z/C/HwAFgwJ/lUzrtgAAAABJRU5ErkJggg==",
          "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z/C/HwAFgwJ/lUzrtgAAAABJRU5ErkJggg=="
        ]
      }
    ];
    
    console.log('Test payload structure:', JSON.stringify(testPayload, null, 2));
    return testPayload;
  };

  // Load data from backend API with StatusId
  const fetchDataByStatus = async (statusId = 1) => {
    console.log(`🔄 Loading data from backend API with StatusId: ${statusId}...`);
    
    try {
      setLoading(true);
      
      // Fetch data from backend API with StatusId parameter
      const response = await fetch(`${config.asnBaseUrl}/api/Article/GetAllArticleMasterDetail?pageNumber=1&pageSize=10&searchText=&StatusId=${statusId}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Backend Error: ${response.status} ${response.statusText}`);
      }
      
      const result = await response.json();
      
      console.log(`📦 Backend API Response for StatusId ${statusId}:`, result);
      
      // Extract articles from response
      let articles = [];
        if (Array.isArray(result)) {
        articles = result;
      } else if (result.data && Array.isArray(result.data)) {
        articles = result.data;
      } else if (result.result && Array.isArray(result.result)) {
        articles = result.result;
      } else if (result.items && Array.isArray(result.items)) {
        articles = result.items;
        } else {
        console.log('⚠️ No articles found in response, using empty array');
        articles = [];
      }
      
      console.log('📦 Extracted Articles:', articles);
      console.log('📏 Articles Count:', articles.length);
      
      if (articles.length > 0) {
        const statusLabels = { 1: 'all', 2: 'recently updated', 3: 'recently added' };
        setApprovalMessage(`✅ Loaded ${articles.length} articles (${statusLabels[statusId]}) from backend`);
        setTimeout(() => setApprovalMessage(""), 3000);
        
        // Process articles data with new structure
        const processedRows = articles.map((row, index) => {
        console.log(`📝 Processing article ${index + 1}:`, row);
        const processedRow = { ...row };
        
          // Map backend fields to frontend display fields
          // Article ID
          if (processedRow.ArticleId) {
            processedRow.ArticleId = processedRow.ArticleId.toString();
          } else {
            processedRow.ArticleId = `MC${String(index + 1).padStart(3, '0')}`;
          }
          
          // Map backend field names to frontend display names
          if (processedRow.MC_CD && !processedRow.MC_CODE) {
            processedRow.MC_CODE = processedRow.MC_CD;
          }
          if (processedRow.FG_SEG && !processedRow.SEG) {
            processedRow.SEG = processedRow.FG_SEG;
          }
          if (processedRow.FG_DIV && !processedRow.DIV) {
            processedRow.DIV = processedRow.FG_DIV;
          }
          if (processedRow.MJ_CAT && !processedRow.MAJ_CAT_NM) {
            processedRow.MAJ_CAT_NM = processedRow.MJ_CAT;
          }
          if (processedRow.MC_DESC && !processedRow.ARTICLE_DESCRIPTION) {
            processedRow.ARTICLE_DESCRIPTION = processedRow.MC_DESC;
          }
          
          // Handle FILE_PATH as Images
          if (processedRow.FILE_PATH && !processedRow.Images) {
            if (typeof processedRow.FILE_PATH === 'string') {
              // Split by comma and keep full URLs
              processedRow.Images = processedRow.FILE_PATH.split(',').map(url => 
                url.trim()
              ).filter(url => url && url !== 'null' && url !== 'undefined' && url !== '');
            } else if (Array.isArray(processedRow.FILE_PATH)) {
              processedRow.Images = processedRow.FILE_PATH.filter(img => 
              img && img !== 'null' && img !== 'undefined' && img !== '' && (typeof img === 'string' && img.trim() !== '')
            );
            }
          } else if (!processedRow.Images) {
            processedRow.Images = [];
        }
          
          // Set STATUS based on IsApproved
          if (processedRow.IsApproved === true) {
            processedRow.STATUS = 'Approved';
          } else if (processedRow.IsApproved === false) {
            processedRow.STATUS = 'Pending';
          } else {
            processedRow.STATUS = 'Draft';
          }
          
          // Set ART_CR_DATE from CreatedOn
          if (processedRow.CreatedOn && !processedRow.ART_CR_DATE) {
            processedRow.ART_CR_DATE = processedRow.CreatedOn;
        }
        
        return processedRow;
        });
      
        console.log('✅ Processed Rows:', processedRows);
        
        // Update state with processed data
      setArticleRows(processedRows);
        setDisplayedArticles(processedRows);
        setTotalArticles(processedRows.length);
        setFilteredArticles(processedRows.length);
        
      } else {
        console.log('📭 No articles found, setting empty state');
        setArticleRows([]);
        setDisplayedArticles([]);
        setTotalArticles(0);
        setFilteredArticles(0);
        setApprovalMessage('ℹ️ No articles found for this status');
        setTimeout(() => setApprovalMessage(""), 3000);
      }
      
    } catch (error) {
      console.error('❌ Error fetching data:', error);
      setApprovalMessage(`❌ Error loading data: ${error.message}`);
      setTimeout(() => setApprovalMessage(""), 5000);
      
      // Set empty state on error
      setArticleRows([]);
      setDisplayedArticles([]);
      setTotalArticles(0);
      setFilteredArticles(0);
    } finally { 
      setLoading(false); 
    }
  };

  // Save handler for Excel modal (add or edit)
  const handleSaveArticleRows = async (articlesArray) => {
    try {
      console.log('💾 Save handler called with articles:', articlesArray);
      
      // Update local state immediately for better UX
      if (articlesArray && articlesArray.length > 0) {
        if (editingRow && editingRow.ArticleId) {
          // Update existing article in local state
        const updatedArticle = articlesArray[0];
        if (updatedArticle.Images && Array.isArray(updatedArticle.Images)) {
          console.log('🖼️ Preserving uploaded images:', updatedArticle.Images.length);
          updatedArticle.Images = updatedArticle.Images
            .filter(img => img && img !== 'null' && img !== 'undefined' && img !== '' && (typeof img === 'string' && img.trim() !== ''))
            .map(img => handleArticleFilesUrl(img));
        }
        
          setArticleRows(prevRows => 
            prevRows.map(row => 
              row.ArticleId === editingRow.ArticleId 
                ? { ...row, ...updatedArticle, DATE: new Date().toISOString().split('T')[0] }
                : row
            )
          );
          handleSuccessfulUpdate();
        } else {
          // Add multiple new articles to local state
          const newArticles = articlesArray.map((article, index) => {
            const newArticle = { ...article };
            
            // Generate unique ArticleId for new articles
            if (!newArticle.ArticleId) {
              newArticle.ArticleId = `MC${String(articleRows.length + index + 1).padStart(3, '0')}`;
            }
            
            // Set default values
            newArticle.STATUS = userRole === 'admin' ? 'Approved' : 'Pending'; // Auto-approve for admin
            newArticle.DATE = newArticle.DATE || new Date().toISOString().split('T')[0];
            newArticle.ART_CR_DATE = newArticle.ART_CR_DATE || new Date().toISOString().split('T')[0];
            
            // Process images
            if (newArticle.Images && Array.isArray(newArticle.Images)) {
              newArticle.Images = newArticle.Images
                .filter(img => img && img !== 'null' && img !== 'undefined' && img !== '' && (typeof img === 'string' && img.trim() !== ''))
                .map(img => handleArticleFilesUrl(img));
            } else {
              newArticle.Images = [];
            }
            
            return newArticle;
          });
          
          setArticleRows(prevRows => [...prevRows, ...newArticles]);
          
          // Update displayed articles to show new articles immediately
          setDisplayedArticles(prevDisplayed => [...prevDisplayed, ...newArticles]);
          
          // Reset to show all articles after adding new ones
          setCurrentFilter('all');
          
          // Force a table refresh by updating the current page
          setCurrentPage(1);
          
          // Trigger a refresh to ensure table updates
          setRefreshTrigger(prev => prev + 1);
          
          // Debug: Log the current state
          console.log('🔄 After adding new articles:');
          console.log('📊 Total articleRows:', articleRows.length + newArticles.length);
          console.log('📊 New articles added:', newArticles.length);
          console.log('📊 Refresh trigger:', refreshTrigger + 1);
          
          setApprovalMessage(`✅ ${newArticles.length} new article(s) added successfully!`);
          
          // POST new articles to backend for admin users
          if (userRole === 'admin') {
            try {
              console.log('🚀 Admin user - POSTing new articles to backend...');
              await sendDataToBackend(newArticles);
              setApprovalMessage(`✅ ${newArticles.length} new article(s) created and posted to backend successfully!`);
            } catch (backendError) {
              console.error('❌ Backend POST failed:', backendError);
              setApprovalMessage(`⚠️ Articles saved locally but backend POST failed: ${backendError.message}`);
            }
          }
        }
      }
      
      // Don't refresh from server to preserve uploaded images
      // The images are already saved in local state and will persist
      console.log('🖼️ Images preserved in local state, skipping server refresh');
      
      setExcelModalOpen(false); // Close Excel modal after successful save
    } catch (error) {
      setApprovalMessage("❌ Error saving data: " + error.message);
    }
  };

  // Save handler for Row Details modal (edit single row)
  const handleSaveRowDetails = async (articlesArray) => {
    try {
      console.log('💾 Update handler called with articles:', articlesArray);
      
      // Update local state immediately for better UX
      if (articlesArray && articlesArray.length > 0) {
        const updatedArticle = articlesArray[0];
        
        // Ensure Images field is preserved properly
        if (updatedArticle.Images && Array.isArray(updatedArticle.Images)) {
          console.log('🖼️ Preserving uploaded images:', updatedArticle.Images.length);
          console.log('🖼️ Original images:', updatedArticle.Images);
          updatedArticle.Images = updatedArticle.Images
            .filter(img => img && img !== 'null' && img !== 'undefined' && img !== '' && (typeof img === 'string' && img.trim() !== ''))
            .map(img => {
              // Keep original URLs from backend - don't modify them
              if (img.startsWith('data:')) {
                // Base64 image - keep as is
                return img;
              } else {
                // Other URLs - keep as is
                return img;
              }
            });
          console.log('🖼️ Processed images:', updatedArticle.Images);
        }
        
        if (selectedRow && selectedRow.ArticleId) {
          // Update existing article in local state
          const updatedRow = { 
            ...selectedRow, 
            ...updatedArticle, 
            DATE: new Date().toISOString().split('T')[0],
            STATUS: userRole === 'admin' ? 'Approved' : (selectedRow.STATUS || 'Pending') // Auto-approve for admin
          };
          
          setArticleRows(prevRows => 
            prevRows.map(row => 
              row.ArticleId === selectedRow.ArticleId 
                ? updatedRow
                : row
            )
          );
          handleSuccessfulUpdate();
          
          // POST updated article to backend for admin users
          if (userRole === 'admin') {
            try {
              console.log('🚀 Admin user - POSTing updated article to backend...');
              await sendDataToBackend([updatedRow]);
              setApprovalMessage(`✅ Article updated and posted to backend successfully!`);
            } catch (backendError) {
              console.error('❌ Backend POST failed:', backendError);
              setApprovalMessage(`⚠️ Article updated locally but backend POST failed: ${backendError.message}`);
            }
          }
        }
      }
      
      // Don't refresh from server to preserve uploaded images
      // The images are already saved in local state and will persist
      console.log('🖼️ Images preserved in local state, skipping server refresh');
      
      setViewModalOpen(false); // Close view modal after successful save
    } catch (error) {
      setApprovalMessage("❌ Error updating data: " + error.message);
    }
  };

  // Send data to backend and refresh UI
  const sendDataToBackend = async (inputData) => {
    try {
      // Always send as a raw array, not wrapped
      const articlesArray = Array.isArray(inputData) ? inputData : [inputData];
      
      // Preprocess the data to ensure proper backend format with FILE_PATH and Images array
      const processedArticles = await Promise.all(articlesArray.map(async (article) => {
        const processed = { ...article };
        
        // Generate FILE_PATH if not provided
        if (!processed.FILE_PATH || processed.FILE_PATH.trim() === '') {
          const articleDesc = processed.ARTICLE_DESCRIPTION || 'article';
          const timestamp = new Date().getTime();
          const sanitizedDesc = articleDesc.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
          processed.FILE_PATH = `/ArticleFiles/${sanitizedDesc}_${timestamp}.jpg`;
        }
        
        // Handle Images field - ensure it's properly formatted as array of base64 strings
        if (processed.Images) {
          if (Array.isArray(processed.Images)) {
            // Filter out invalid images and ensure they are base64 strings
            processed.Images = processed.Images.filter(img => 
              img && 
              img !== 'null' && 
              img !== 'undefined' && 
              img !== '' && 
              (typeof img === 'string' && img.trim() !== '')
            );
          } else if (typeof processed.Images === 'string') {
            // Convert string to array
            processed.Images = processed.Images.split(/[,\s;]+/).filter(url => url && url.trim());
          } else {
            processed.Images = [];
          }
        } else {
          processed.Images = [];
        }
        
        console.log('📁 Processing article for backend:', {
          articleDesc: processed.ARTICLE_DESCRIPTION,
          filePath: processed.FILE_PATH,
          imagesCount: processed.Images.length,
          imagesSample: processed.Images.length > 0 ? processed.Images[0].substring(0, 50) + '...' : 'Dummy Image'
        });
        
        // Map to backend field names
        return mapFrontendToBackend(processed);
      }));
      
      // Show payload in console for debugging
      
      // Send article data in request body as JSON
      console.log('Sending JSON data to backend with articles:', processedArticles.length);
      console.log('Article data to send:', processedArticles);
      
      // Try direct array format first (as shown in Swagger)
      let payload = processedArticles;
      console.log('Sending direct array payload to backend:', payload);
      
      const response = await fetch(`${config.asnBaseUrl}/api/Article/InsertArticleData`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Backend error response:', errorText);
        
        // If 400 error, try alternative format with articles wrapper
        if (response.status === 400) {
          console.log('Trying alternative payload format with articles wrapper...');
          
          // Try with articles wrapper
          const alternativePayload = {
            articles: processedArticles
          };
          console.log('Alternative payload with articles wrapper:', alternativePayload);
          
          const altResponse = await fetch(`${config.asnBaseUrl}/api/Article/InsertArticleData`, {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(alternativePayload)
          });
          
          if (!altResponse.ok) {
            const altErrorText = await altResponse.text();
            console.error('Alternative format also failed:', altErrorText);
            throw new Error(`Backend Error: ${altResponse.status} ${altResponse.statusText}. ${altErrorText}`);
          }
          
          console.log('Alternative format succeeded!');
          // Continue with success flow
        } else {
          throw new Error(`Backend Error: ${response.status} ${response.statusText}. ${errorText}`);
        }
      }
      
      const res = await fetch(`${config.asnBaseUrl}/api/Article/GetAllArticleMasterDetail`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      if (!res.ok) {
        console.log('GetAll API not available, using existing data');
      } else {
        const data = await res.json();
        console.log('Updated data from server:', data);
      }
      
      setApprovalMessage("✅ Data saved successfully!");
      // Don't refresh from server to preserve uploaded images
      console.log('🖼️ Data saved successfully, preserving local images');
      
    } catch (err) {
      
      let errorMessage = "❌ Backend Error: ";
      
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        errorMessage += "Network error - unable to connect to server";
      } else if (err.message) {
        // Show the actual backend error message
        errorMessage += err.message;
      } else {
        errorMessage += "Unknown error occurred";
      }
      
      console.error('Full error details:', err);
        setApprovalMessage(errorMessage);
      setTimeout(() => setApprovalMessage(""), 10000); // Show error for 10 seconds
    }
  };

  // Update delete logic to use ArticleId and correct API params
  const handleDeleteRow = (row) => {
    setRowToDelete(row);
    setDeleteModalOpen(true);
  };

  const confirmDeleteRow = async () => {
    if (rowToDelete) {
      try {
        console.log('🗑️ Deleting article with ID:', rowToDelete.ArticleId);
        
        const baseUrl = `${config.asnBaseUrl}/api/Article/DeleteArticleDetails`;
        const qs = `?articleIds=${rowToDelete.ArticleId}&deletedBy=admin`;
        let response;

        // 1) Try POST with query params (most common on this backend)
        try {
          response = await fetch(`${baseUrl}${qs}`, {
          method: 'POST',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }
          });
        } catch (e) {
          response = undefined;
        }

        // 2) If 405/unsupported or network issue, try POST with JSON body
        if (!response || !response.ok) {
          if (!response || response.status === 405 || response.status === 415 || response.status === 400) {
            try {
              response = await fetch(baseUrl, {
                method: 'POST',
                headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
                body: JSON.stringify({ articleIds: `${rowToDelete.ArticleId}`, deletedBy: 'admin' })
              });
            } catch (e) {
              response = undefined;
            }
          }
        }

        // 3) Final fallback: GET with query params (if server only allows GET)
        if (!response || !response.ok) {
          try {
            response = await fetch(`${baseUrl}${qs}`, {
              method: 'GET',
              headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }
            });
          } catch (e) {
            response = undefined;
          }
        }
        
        if (!response || !response.ok) {
          throw new Error(`HTTP ${response ? response.status : 'NETWORK'}: ${response ? response.statusText : 'No response'}`);
        }
        
              const result = await response.json();
        console.log('📄 Delete API Result:', result);
        
        if (result.status === true) {
          console.log('✅ Article deleted successfully!');
          setApprovalMessage("✅ Article deleted successfully!");
          
          const deletedArticle = { ...rowToDelete, deletedAt: new Date().toISOString() };
          setDeletedArticles(prev => [...prev, deletedArticle]);
          setArticleRows(prevRows => prevRows.filter(row => row.ArticleId !== rowToDelete.ArticleId));
          setDisplayedArticles(prevDisplayed => prevDisplayed.filter(row => row.ArticleId !== rowToDelete.ArticleId));
          // Don't refresh data from server - keep local changes
          // await fetchDataByStatus(1);
              } else {
          console.log('⚠️ Delete API returned false status:', result);
          setApprovalMessage(`⚠️ Delete failed: ${result.message || 'Unknown error'}`);
        }
        
      } catch (err) {
        console.error('❌ Delete error:', err);
        setApprovalMessage("❌ Error deleting article: " + err.message);
      }
      
      setRowToDelete(null);
      setDeleteModalOpen(false);
    }
  };

  const cancelDeleteRow = () => {
          setRowToDelete(null);
          setDeleteModalOpen(false);
  };

  // Restore deleted article
  const handleRestoreArticle = async (deletedArticle) => {
    try {
      console.log('🔄 Restoring deleted article:', deletedArticle.ArticleId);
      setApprovalMessage("🔄 Restoring article...");
      
      // Remove from deleted articles
      setDeletedArticles(prev => prev.filter(article => article.ArticleId !== deletedArticle.ArticleId));
      
      // Add back to active articles
      const restoredArticle = { ...deletedArticle };
      delete restoredArticle.deletedAt; // Remove deletion timestamp
      restoredArticle.STATUS = 'Pending'; // Reset status to pending
      
      setArticleRows(prev => [...prev, restoredArticle]);
      setDisplayedArticles(prev => [...prev, restoredArticle]);
      
      setApprovalMessage("✅ Article restored successfully!");
      setTimeout(() => setApprovalMessage(""), 3000);
      
    } catch (err) {
      console.error('❌ Error restoring article:', err);
      setApprovalMessage("❌ Error restoring article: " + err.message);
      setTimeout(() => setApprovalMessage(""), 5000);
    }
  };

  // Permanently delete article (remove from deleted list)
  const handlePermanentDelete = async (deletedArticle) => {
    setRowToDelete(deletedArticle);
    setDeleteModalOpen(true);
  };

  // Confirm permanent deletion
  const confirmPermanentDelete = async () => {
    if (rowToDelete) {
      try {
        console.log('🗑️ Permanently deleting article:', rowToDelete.ArticleId);
        setApprovalMessage("🗑️ Permanently deleting article...");
        
        // Remove from deleted articles permanently
        setDeletedArticles(prev => prev.filter(article => article.ArticleId !== rowToDelete.ArticleId));
        
        setApprovalMessage("✅ Article permanently deleted!");
        setTimeout(() => setApprovalMessage(""), 3000);
        
      } catch (err) {
        console.error('❌ Error permanently deleting article:', err);
        setApprovalMessage("❌ Error permanently deleting article: " + err.message);
        setTimeout(() => setApprovalMessage(""), 5000);
      }
      
      setRowToDelete(null);
      setDeleteModalOpen(false);
    }
  };



  // Handler for selecting/deselecting a row
  const handleSelectRow = (articleId) => {
    setSelectedRows(prev =>
      prev.includes(articleId)
        ? prev.filter(id => id !== articleId)
        : [...prev, articleId]
    );
  };
  // Handler for selecting/deselecting all rows
  const handleSelectAll = () => {
    if (paginatedData.every(row => selectedRows.includes(row["ArticleId"]))) {
      setSelectedRows(prev => prev.filter(id => !paginatedData.some(row => row["ArticleId"] === id)));
    } else {
      setSelectedRows(prev => [
        ...prev,
        ...paginatedData
          .map(row => row["ArticleId"])
          .filter(id => !prev.includes(id))
      ]);
    }
  };
  // Handler for batch delete
  const handleBatchDelete = async () => {
    if (selectedRows.length === 0) return;
    try {
      console.log('🗑️ Batch deleting articles:', selectedRows);
      
      const baseUrl = `${config.asnBaseUrl}/api/Article/DeleteArticleDetails`;
      const ids = selectedRows.join(',');
      const qs = `?articleIds=${ids}&deletedBy=admin`;
      let response;

      // 1) Try POST with query params
      try {
        response = await fetch(`${baseUrl}${qs}`, {
        method: 'POST',
          headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }
        });
      } catch (e) {
        response = undefined;
      }

      // 2) If 405/unsupported, try POST with JSON body
      if (!response || !response.ok) {
        if (!response || response.status === 405 || response.status === 415 || response.status === 400) {
          try {
            response = await fetch(baseUrl, {
              method: 'POST',
              headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
              body: JSON.stringify({ articleIds: ids, deletedBy: 'admin' })
            });
          } catch (e) {
            response = undefined;
          }
        }
      }

      // 3) Final fallback: GET
      if (!response || !response.ok) {
        try {
          response = await fetch(`${baseUrl}${qs}`, {
            method: 'GET',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }
          });
        } catch (e) {
          response = undefined;
        }
      }
      
      if (!response || !response.ok) {
        throw new Error(`HTTP ${response ? response.status : 'NETWORK'}: ${response ? response.statusText : 'No response'}`);
      }
      
      const result = await response.json();
      console.log('📄 Batch Delete API Result:', result);
      
      if (result.status === true) {
        console.log(`✅ ${selectedRows.length} article(s) deleted successfully!`);
        setApprovalMessage(`✅ ${selectedRows.length} article(s) deleted successfully!`);
        
        const articlesToDelete = articleRows.filter(row => selectedRows.includes(row.ArticleId));
        const deletedArticlesWithTimestamp = articlesToDelete.map(article => ({
          ...article,
          deletedAt: new Date().toISOString()
        }));
        setDeletedArticles(prev => [...prev, ...deletedArticlesWithTimestamp]);
        setArticleRows(prevRows => prevRows.filter(row => !selectedRows.includes(row.ArticleId)));
        setDisplayedArticles(prevDisplayed => prevDisplayed.filter(row => !selectedRows.includes(row.ArticleId)));
        // Don't refresh data from server - keep local changes
        // await fetchDataByStatus(1);
      } else {
        console.log('⚠️ Batch delete API returned false status:', result);
        setApprovalMessage(`⚠️ Batch delete failed: ${result.message || 'Unknown error'}`);
      }
      
    } catch (err) {
      console.error('❌ Batch delete error:', err);
      setApprovalMessage("❌ Error deleting articles: " + err.message);
    }
    
    setSelectedRows([]);
  };
  const handleBatchApproval = () => {
    setShowApprovalModal(true);
  };
  
  // Update confirmBatchApproval to use the approval API
  const confirmBatchApproval = async () => {
    if (selectedRows.length === 0) return;
    try {
      setApprovalMessage("🔄 Sending articles for approval...");
      
      // Use the new approval service with JWT authentication
      const result = await approvalService.sendArticlesForApproval(selectedRows);
      console.log('📄 Batch Approval API Result:', result);
      
      // Check if the response indicates success
      if (result.success === true || result.status === true) {
        console.log(`✅ ${selectedRows.length} article(s) sent for approval successfully!`);
        setApprovalMessage(`✅ ${selectedRows.length} article(s) sent for approval successfully!`);
        
        // Update STATUS to 'Sent for Approval' for the relevant articles in local state
        setArticleRows(prevRows => prevRows.map(row =>
          selectedRows.includes(row.ArticleId) ? { ...row, STATUS: 'Sent for Approval' } : row
        ));
        
        // Update displayed articles as well
        setDisplayedArticles(prevDisplayed => prevDisplayed.map(row =>
          selectedRows.includes(row.ArticleId) ? { ...row, STATUS: 'Sent for Approval' } : row
        ));
        
        // Don't refresh data from server - keep local changes
        // await fetchDataByStatus(1);
      } else {
        console.log('⚠️ Approval API returned false status:', result);
        setApprovalMessage(`⚠️ Approval failed: ${result.message || 'Unknown error'}`);
      }
      
    } catch (err) {
      console.error('❌ Approval error:', err);
      setApprovalMessage("❌ Error sending for approval: " + err.message);
    }
    
    setSelectedRows([]);
    setShowApprovalModal(false);
  };
  const cancelBatchApproval = () => {
    setShowApprovalModal(false);
  };

  // Handle individual article approval/rejection
  const handleApproveArticle = async (articleId, action) => {
    try {
      setApprovalMessage(`🔄 ${action === 'Approve' ? 'Approving' : 'Rejecting'} article...`);
      
      const remarks = action === 'Approve' ? 'Approved by user' : 'Rejected by user';
      const result = await approvalService.approveByLevel([articleId], action, remarks);
      
      if (result.success === true || result.status === true) {
        console.log(`✅ Article ${action.toLowerCase()}d successfully:`, result);
        setApprovalMessage(`✅ Article ${action.toLowerCase()}d successfully!`);
        
        // Update article status
        const newStatus = action === 'Approve' ? 'Approved' : 'Rejected';
        setArticleRows(prevRows => prevRows.map(row =>
          row.ArticleId === articleId ? { ...row, STATUS: newStatus } : row
        ));
        
        setDisplayedArticles(prevDisplayed => prevDisplayed.map(row =>
          row.ArticleId === articleId ? { ...row, STATUS: newStatus } : row
        ));
        
        // Don't refresh data from server - keep local changes
        // await fetchDataByStatus(1);
      } else {
        console.log(`⚠️ ${action} API returned false status:`, result);
        setApprovalMessage(`⚠️ ${action} failed: ${result.message || 'Unknown error'}`);
      }
    } catch (err) {
      console.error(`❌ ${action} error:`, err);
      setApprovalMessage(`❌ Error ${action.toLowerCase()}ing article: ` + err.message);
    }
    
    setTimeout(() => {
      setApprovalMessage("");
    }, 5000);
  };

  // Handle individual article send for approval
  const handleSendForApproval = async (articleId) => {
    try {
      setApprovalMessage("🔄 Sending article for approval...");
      
      // Use the approval service with JWT authentication
      const result = await approvalService.sendArticlesForApproval([articleId]);
      console.log('📄 Individual Approval API Result:', result);
      
      // Check if the response indicates success
      if (result.success === true || result.status === true) {
        console.log('✅ Article sent for approval successfully!');
        setApprovalMessage("✅ Article sent for approval successfully!");
        
        // Update the article status to 'Sent for Approval'
        setArticleRows(prevRows => prevRows.map(row =>
          row.ArticleId === articleId ? { ...row, STATUS: 'Sent for Approval' } : row
        ));
        
        // Update displayed articles as well
        setDisplayedArticles(prevDisplayed => prevDisplayed.map(row =>
          row.ArticleId === articleId ? { ...row, STATUS: 'Sent for Approval' } : row
        ));
        
        // Don't refresh data from server - keep local changes
        // await fetchDataByStatus(1);
      } else {
        console.log('⚠️ Individual approval API returned false status:', result);
        setApprovalMessage(`⚠️ Approval failed: ${result.message || 'Unknown error'}`);
      }
      
    } catch (err) {
      console.error('❌ Individual approval error:', err);
      setApprovalMessage("❌ Error sending for approval: " + err.message);
    }
    
    setTimeout(() => {
      setApprovalMessage("");
    }, 5000);
  };

  // Filtering and pagination logic
  const filteredData = getFilteredArticles();

  // Pagination logic
  const rowsPerPage = 30;
  const totalPages = Math.ceil(filteredData.length / rowsPerPage) || 1;
  const paginatedData = filteredData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
  // Reset to page 1 if filter changes and currentPage is out of range
  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1);
  }, [filteredData.length, totalPages]);

  // Custom Excel export for Article Parcel (all columns)
  const exportArticleParcelToExcel = () => {
    const headers = columnNames;
    const rows = filteredData.map((row) => columnNames.map((col) => row[col]));
    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Article Parcel");
    XLSX.writeFile(workbook, `Article_Parcel_${new Date().toISOString()}.xlsx`);
  };

  const handleRecentlyAdd = () => {
    // Fetch recently added articles from backend API (StatusId = 3) - COMMENTED OUT to prevent data reset
    // fetchDataByStatus(3);
    setCurrentFilter('recent');
  };

  const handleUpdateData = () => {
    // Fetch recently updated articles from backend API (StatusId = 2) - COMMENTED OUT to prevent data reset
    // fetchDataByStatus(2);
    setCurrentFilter('updated');
  };

  const handleShowAll = () => {
    // Fetch all articles from backend API (StatusId = 1) - COMMENTED OUT to prevent data reset
    // fetchDataByStatus(1);
    setCurrentFilter('all');
  };

  // Open modal with row data
  const handleView = async (row) => {
    try {
      // Use the row data directly (no API calls)
        setSelectedRow(row);
      setViewModalOpen(true);
    } catch (error) {
      setApprovalMessage("❌ Error opening article details: " + error.message);
      setTimeout(() => setApprovalMessage(""), 5000);
    }
  };

  // In the ArticleParcel component, add state for counts:
  const [totalArticles, setTotalArticles] = useState(0);
  const [filteredArticles, setFilteredArticles] = useState(0);
  const [updatedCount, setUpdatedCount] = useState(0);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Update counts after fetching data:
  useEffect(() => {
    console.log('🔄 articleRows changed:', articleRows.length, 'items');
    setTotalArticles(articleRows.length);
    setFilteredArticles(filteredData.length);
    
    // Only initialize displayed articles if they haven't been set yet
    if (displayedArticles.length === 0) {
      setDisplayedArticles(articleRows);
    }
  }, [articleRows, filteredData, refreshTrigger]);



  // Function to handle successful updates
  const handleSuccessfulUpdate = () => {
    setUpdatedCount(prev => prev + 1);
    setApprovalMessage(`✅ Article updated successfully! (Total updates: ${updatedCount + 1})`);
    setTimeout(() => setApprovalMessage(""), 3000);
  };

  // Function to mark article as updated with current date
  const markArticleAsUpdated = (articleId) => {
    setArticleRows(prevRows => 
      prevRows.map(row => 
        row.ArticleId === articleId 
          ? { ...row, DATE: new Date().toISOString().split('T')[0] }
          : row
      )
    );
  };

  // Function to reset update count (optional - can be called when needed)
  const resetUpdateCount = () => {
    setUpdatedCount(0);
  };

  // Dropdown functions moved to ArticleParcelViewModal.jsx
  const fetchMcCodes = async (majorCatId) => {
    console.log('Dropdown functions moved to modal component');
  };

  // Dropdown functions moved to ArticleParcelViewModal.jsx
  const fetchMcDescriptions = async (mcCodeId) => {
    console.log('Dropdown functions moved to modal component');
  };

  // Handle sending selected articles to approval
  const handleSendToApproval = () => {
    if (selectedRows.length === 0) {
      setApprovalMessage("❌ No articles selected for approval");
      setTimeout(() => setApprovalMessage(""), 3000);
      return;
    }

    try {
      // Update the status of selected articles to "Sent for Approval"
      setArticleRows(prevRows => 
        prevRows.map(row => 
          selectedRows.includes(row.ArticleId) 
            ? { ...row, STATUS: 'Sent for Approval' }
            : row
        )
      );

      // Update displayed articles as well
      setDisplayedArticles(prevDisplayed => 
        prevDisplayed.map(row => 
          selectedRows.includes(row.ArticleId) 
            ? { ...row, STATUS: 'Sent for Approval' }
            : row
        )
      );

      // Clear selection
      setSelectedRows([]);

      // Show success message
      setApprovalMessage(`✅ ${selectedRows.length} article(s) sent for approval successfully! Status changed to "Sent for Approval"`);
      
      // Auto-hide message after 5 seconds
      setTimeout(() => setApprovalMessage(""), 5000);

      // Force table refresh
      setRefreshTrigger(prev => prev + 1);

    } catch (error) {
      setApprovalMessage(`❌ Error sending articles for approval: ${error.message}`);
      setTimeout(() => setApprovalMessage(""), 5000);
    }
  };

  return (
    <div className="article-parcel-container">
      {loading && (
        <div className="modern-loading">
          <div className="modern-loading-spinner"></div>
          Loading articles...
        </div>
      )}
      
      {/* Modern Toast Messages */}
      {approvalMessage && (
        <div className={`modern-toast ${approvalMessage.startsWith('✅') ? 'success' : approvalMessage.startsWith('🔄') ? 'info' : approvalMessage.startsWith('📊') ? 'info' : approvalMessage.startsWith('ℹ️') ? 'info' : 'error'}`}>
          <div className="modern-toast-content">
            {approvalMessage.startsWith('✅') ? <FaCheckCircle /> : 
             approvalMessage.startsWith('🔄') ? <FiRefreshCw /> : 
             approvalMessage.startsWith('📊') ? <FiList /> :
             approvalMessage.startsWith('ℹ️') ? <FaInfoCircle /> :
             <FaTimesCircle />}
            <span>{approvalMessage}</span>
            </div>
          <button 
            onClick={() => setApprovalMessage("")}
            className="modern-toast-close"
            title="Close message"
          >
            ×
          </button>
          </div>
      )}
      
      {/* Image Errors Summary - COMMENTED OUT FOR NOW */}
      {/*
      {imageErrors.length > 0 && (
        <div className="modern-toast error" style={{ top: '80px', maxWidth: '500px' }}>
          <div className="modern-toast-content">
            <FaTimesCircle />
            <span>{imageErrors.length} image(s) not found on server (404 errors)</span>
            <small style={{ display: 'block', marginTop: '4px', opacity: 0.8 }}>
              Recent files: {imageErrors.slice(-5).join(', ')}
              {imageErrors.length > 5 && ` (+${imageErrors.length - 5} more)`}
            </small>
            <small style={{ display: 'block', marginTop: '2px', opacity: 0.6, fontSize: '11px' }}>
              This is normal if image files don't exist on the server yet
            </small>
          </div>
          <button 
            onClick={clearImageErrors}
            className="modern-toast-close"
            title="Clear image errors"
          >
            ×
          </button>
        </div>
      )}
      */}
      
      <div className="modern-card">
        {/* Modern Header */}
        <div className="modern-header">
          <h1 className="modern-title">
            <FiPackage style={{ fontSize: '2.2rem', color: '#1e3a8a' }} />
            Article Parcel
          </h1>
      </div>

        {/* Modern Toolbar */}
        <div className="modern-toolbar">
          {/* Search Bar */}
          <div className="modern-search">
            <FiSearch className="modern-search-icon" />
        <input
          type="text"
                  placeholder="Search articles, suppliers, LPO, etc…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

          {/* Action Buttons */}
          <div className="modern-actions">
            <button className="modern-btn modern-btn-outline" onClick={handleRecentlyAdd}>
              <FiClock style={{ fontSize: '1.2rem' }} /> Recently Added
              <span className="modern-btn-badge">{(() => {
                // This will be updated dynamically when data is fetched
                return articleRows.filter(row => row.STATUS === 'New').length;
              })()}</span>
        </button>
            <button className="modern-btn modern-btn-outline" onClick={handleUpdateData}>
              <FiRefreshCw style={{ fontSize: '1.2rem' }} /> Recently Updated
              <span className="modern-btn-badge">{(() => {
                // This will be updated dynamically when data is fetched
                return articleRows.filter(row => row.STATUS === 'Updated').length;
              })()}</span>
            </button>
            <button className="modern-btn modern-btn-outline" onClick={handleShowAll}>
              <FiList style={{ fontSize: '1.2rem' }} /> Show All
              <span className="modern-btn-badge">{(() => {
                // This will be updated dynamically when data is fetched
                return articleRows.filter(row => row.STATUS === 'All' || !row.STATUS).length;
              })()}</span>
            </button>
            <button className="modern-btn modern-btn-outline" onClick={exportArticleParcelToExcel}>
              <FiDownload style={{ fontSize: '1.2rem' }} /> Export
            </button>



            <button className="modern-btn modern-btn-success" onClick={() => {
              setEditingRow(null); // Reset editing row for new article
              setExcelModalOpen(true);
            }}>
              <FiPlus style={{ fontSize: '1.2rem' }} /> Add New Article
            </button>
      </div>
           </div>


        {/* Modern Batch Actions */}
          {selectedRows.length > 0 && (
          <div className="modern-batch-actions">
            <div className="modern-batch-info">
              <FaCheckCircle />
              <span>{selectedRows.length} article(s) selected</span>
            </div>
            <div className="modern-batch-buttons">
              <button className="modern-btn modern-btn-success" onClick={handleSendToApproval}>
                <FaCheckCircle /> Send to Approval
              </button>
              <button className="modern-btn modern-btn-danger" onClick={() => setDeleteModalOpen(true)}>
                <FiTrash /> Delete Selected
              </button>
            </div>
            </div>
          )}
        {/* Modern Table */}
        <div className="modern-table-container">
          {/* Send to Approval Button section removed - only use the top button */}
          {/* Force redeploy - UI fix */}
          
          <div className="modern-table-wrapper">
            <table className="modern-table">
            <thead>
              <tr>
                <th className="fixed-column">
                    <input
                      type="checkbox"
                      checked={paginatedData.length > 0 && paginatedData.every(row => selectedRows.includes(row["ArticleId"]))}
                      onChange={handleSelectAll}
                    style={{ width: '16px', height: '16px' }}
                    />
                  </th>
                {/* Main table columns */}
                {(currentTabState === 7 ? deletedTableColumns : mainTableColumns).map((heading, index) => (
                  <th key={`${heading}-${index}`} className="fixed-column" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {heading === 'deletedAt' ? 'Deleted Date' : getReadableHeader(heading)}
                  </th>
                ))}
                <th className="fixed-column">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length === 0 ? (
                <tr>
                    <td colSpan={mainTableColumns.length + 2}>
                      
                    </td>
                </tr>
              ) : (
                  paginatedData.map((row, idx) => {
                    const isSelected = selectedRows.includes(row["ArticleId"]);
                    return (
                    <tr key={idx + (currentPage - 1) * rowsPerPage} className={isSelected ? "selected-row" : ""}>
                      <td className="fixed-column">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleSelectRow(row["ArticleId"])}
                          style={{ width: '16px', height: '16px' }}
                          />
                        </td>
                      {/* Main table columns */}
                      {(currentTabState === 7 ? deletedTableColumns : mainTableColumns).map((header, colIdx) => {
                        // Map display names to actual field names based on API data structure
                        const fieldMap = {
                          "MC_CODE": "MC_CODE",
                          "FG_SEG": "FG_SEG", 
                          "FG_DIV": "FG_DIV",
                          "MJ_CAT": "MJ_CAT",
                          "ARTICLE_DESCRIPTION": "ARTICLE_DESCRIPTION",
                          "STATUS": "STATUS",
                          "Images": "Images",
                          "deletedAt": "deletedAt"
                        };
                        
                        const actualField = fieldMap[header] || header;
                        
                        // Debug logging removed
                        
                        const cellValue = row[actualField];
                        // Debug logging removed
                        
                        // Fallback display if field is missing
                        const displayValue = cellValue !== undefined && cellValue !== null ? cellValue : `[No ${actualField}]`;
                        
                        return (
                          <td key={colIdx} className="fixed-column" style={{ textAlign: 'center' }}>
                            {header === "STATUS"
                              ? statusBadge(row[actualField])
                              : header === "deletedAt"
                                ? (() => {
                                    const deletedDate = row[actualField];
                                    if (!deletedDate) return 'Unknown';
                                    
                                    try {
                                      const date = new Date(deletedDate);
                                      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
                                    } catch (e) {
                                      return deletedDate;
                                    }
                                  })()
                              : header === "Images"
                                ? (() => {
                                    // Debug logging removed
                                    
                                    const imagesArr =
                                      typeof row.Images === 'string'
                                        ? row.Images.split(/[,\s;]+/).map(url => url.trim()).filter(url => url && url !== 'null' && url !== 'undefined' && url !== '')
                                        : Array.isArray(row.Images)
                                          ? row.Images.filter(img => img && img !== 'null' && img !== 'undefined' && img !== '')
                                          : [];
                                    
                                    // Debug logging removed
                                    
                                   if (!imagesArr || imagesArr.length === 0) {
                                     return (
                                       <div className="modern-image-placeholder">
                                         <img 
                                           src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBmaWxsPSIjZmFmYWZhIiIvPjxjaXJjbGUgY3g9IjUwIiBjeT0iMzUiIHI9IjE1IiBmaWxsPSIjZGRlNGY3Ii8+PHBhdGggZD0iTTM1IDQ1aDNsLTItNmgydjZ6bTQgMGgzbC0yLTZoMnY2eiIgZmlsbD0iI2RkZTRmNyIvPjx0ZXh0IHg9IjUwIiB5PSI3MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjgiIGZpbGw9IiM5Y2EzYWYiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkltYWdlPC90ZXh0Pjwvc3ZnPg=="
                                           alt="Dummy Image"
                                           className="modern-image-thumbnail"
                                           style={{ 
                                             width: '40px', 
                                             height: '40px',
                                             border: '1px solid #d1d5db',
                                             borderRadius: '8px',
                                             backgroundColor: '#f9fafb'
                                           }}
                                         />
                                       </div>
                                     );
                                   }
                                   
                                   return (
                                     <div className="modern-image-grid">
                                       {imagesArr.slice(0, 2).map((imageUrl, idx) => {
                                         console.log('🖼️ Displaying image:', imageUrl.substring(0, 50) + '...');
                                         // Enhanced image URL handling - use original URLs from backend
                                         let displayUrl = imageUrl;
                                         
                                         // If it's already our placeholder, use it directly
                                         if (imageUrl.includes('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBmaWxsPSIjZmFmYWZhIiIvPjxjaXJjbGUgY3g9IjUwIiBjeT0iMzUiIHI9IjE1IiBmaWxsPSIjZGRlNGY3Ii8+PHBhdGggZD0iTTM1IDQ1aDNsLTItNmgydjZ6bTQgMGgzbC0yLTZoMnY2eiIgZmlsbD0iI2RkZTRmNyIvPjx0ZXh0IHg9IjUwIiB5PSI3MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjgiIGZpbGw9IiM5Y2EzYWYiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkltYWdlPC90ZXh0Pjwvc3ZnPg==')) {
                                           displayUrl = imageUrl;
                                         } else if (imageUrl.startsWith('data:image')) {
                                           // Base64 image - keep as is
                                           displayUrl = imageUrl;
                                         } else if (imageUrl.startsWith('http')) {
                                           // Full URL from backend - use as is
                                           displayUrl = imageUrl;
                                         } else if (imageUrl.length > 100 && !imageUrl.includes('http')) {
                                           // Likely base64 without prefix - add prefix
                                           displayUrl = `data:image/jpeg;base64,${imageUrl}`;
                                         } else {
                                           // Use original URL from backend
                                           displayUrl = imageUrl;
                                         }
                                         
                                         return (
                                           <img
                                             key={idx}
                                             src={displayUrl}
                                             alt={`Article Image ${idx + 1}`}
                                             className="modern-image-thumbnail"

                                             onError={async e => { 
                                               e.target.onerror = null; 
                                               
                                               // If it's not already a placeholder, show placeholder
                                               if (!imageUrl.includes('data:image/svg+xml')) {
                                                 console.log(`🖼️ Image failed to load: ${imageUrl}`);
                                                 
                                                 // Use placeholder image - COMMENTED OUT FOR NOW
                                                 // handleImageError(imageUrl, e.target);
                                               }
                                             }}
                                             style={{
                                               width: '40px',
                                               height: '40px',
                                               objectFit: 'cover',
                                               borderRadius: '8px'
                                             }}
                                           />
                                         );
                                       })}
                                       {imagesArr.length > 2 && (
                                         <div className="modern-image-more" style={{
                                           width: '40px',
                                           height: '40px',
                                           background: 'rgba(102, 126, 234, 0.1)',
                                           borderRadius: '8px',
                                           display: 'flex',
                                           alignItems: 'center',
                                           justifyContent: 'center',
                                           fontSize: '12px',
                                           color: '#667eea',
                                           fontWeight: 'bold'
                                         }}>
                                           +{imagesArr.length - 2}
                                         </div>
                                       )}
                                     </div>
                                   );
                                 })()
                               : row[actualField]}
                          </td>
                        );
                      })}
                      <td className="fixed-column">
                        <div className="modern-action-buttons" style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                          {currentTabState === 7 ? (
                            // Deleted articles tab - show restore and permanent delete
                            <>
                          <button
                            className="modern-action-btn modern-action-btn-view"
                              onClick={() => { 
                                setSelectedRow(row); 
                                setViewModalOpen(true); 
                              }}
                            title="View Details"
                                disabled={selectedRows.length > 0}
                                style={{ 
                                  cursor: 'pointer', 
                                  zIndex: 1000,
                                  width: '28px',
                                  height: '28px',
                                  fontSize: '12px',
                                  padding: '0',
                                  opacity: selectedRows.length > 0 ? 0.5 : 1
                                }}
                              >
                                <FaEye />
                              </button>
                              <button
                                className="modern-action-btn modern-action-btn-success"
                                onClick={() => handleRestoreArticle(row)}
                                title="Restore Article"
                                style={{ 
                                  cursor: 'pointer', 
                                  zIndex: 1000,
                                  width: '28px',
                                  height: '28px',
                                  fontSize: '12px',
                                  padding: '0',
                                  backgroundColor: '#10b981',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '4px'
                                }}
                              >
                                <FaCheckCircle />
                              </button>
                              <button
                                className="modern-action-btn modern-action-btn-delete"
                                onClick={() => handlePermanentDelete(row)}
                                title="Permanently Delete"
                            style={{ 
                              cursor: 'pointer', 
                              zIndex: 1000,
                              width: '28px',
                              height: '28px',
                              fontSize: '12px',
                              padding: '0'
                                }}
                              >
                                <FaTrash />
                              </button>
                            </>
                          ) : (
                            // Active articles tab - show normal actions
                            <>
                          <button
                            className="modern-action-btn modern-action-btn-view"
                            onClick={() => { 
                              setSelectedRow(row); 
                              setViewModalOpen(true); 
                            }}
                            title="View Details"
                            disabled={selectedRows.length > 0}
                            style={{ 
                              cursor: 'pointer', 
                              zIndex: 1000,
                              width: '28px',
                              height: '28px',
                              fontSize: '12px',
                              padding: '0',
                              opacity: selectedRows.length > 0 ? 0.5 : 1
                            }}
                          >
                            <FaEye />
                          </button>
                          <button
                            className="modern-action-btn modern-action-btn-edit"
                              onClick={() => {
                                // Set the editing row data immediately with current row
                                setEditingRow(row);
                                
                                // Open modal immediately
                                setExcelModalOpen(true);
                              }}
                            title={`Edit Entry${updatedCount > 0 ? ` (${updatedCount} updated)` : ''}`}
                            disabled={selectedRows.length > 0}
                            style={{ 
                              cursor: 'pointer', 
                                zIndex: '1000',
                              position: 'relative',
                              width: '28px',
                              height: '28px',
                              fontSize: '12px',
                              padding: '0',
                              opacity: selectedRows.length > 0 ? 0.5 : 1
                            }}
                          >
                            <FaEdit />
                            {updatedCount > 0 && (
                              <span style={{
                                position: 'absolute',
                                top: '-8px',
                                right: '-8px',
                                backgroundColor: '#10b981',
                                color: 'white',
                                borderRadius: '50%',
                                width: '18px',
                                height: '18px',
                                fontSize: '10px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 'bold'
                              }}>
                                {updatedCount}
                              </span>
                            )}
                          </button>
                          <button
                            className="modern-action-btn modern-action-btn-delete"
                              onClick={() => {
                                setRowToDelete(row);
                                setDeleteModalOpen(true);
                              }}
                            title="Delete Entry"
                            disabled={selectedRows.length > 0}
                            style={{ 
                              cursor: 'pointer', 
                              zIndex: 1000,
                              width: '28px',
                              height: '28px',
                              fontSize: '12px',
                              padding: '0',
                              opacity: selectedRows.length > 0 ? 0.5 : 1
                            }}
                          >
                            <FaTrash />
                          </button>
                          
                          {/* Approval Buttons - REMOVED - Only use the main green button above */}
                          
                          {row.STATUS === 'Sent for Approval' && approvalService.canApprove() && (
                            <>
                              <button
                                className="modern-action-btn modern-action-btn-success"
                                onClick={() => handleApproveArticle(row.ArticleId, 'Approve')}
                                title="Approve Article"
                                disabled={selectedRows.length > 0}
                                style={{ 
                                  cursor: 'pointer', 
                                  zIndex: 1000,
                                  width: '28px',
                                  height: '28px',
                                  fontSize: '12px',
                                  padding: '0',
                                  backgroundColor: '#10b981',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '4px',
                                  opacity: selectedRows.length > 0 ? 0.5 : 1
                                }}
                              >
                                <FaCheckCircle />
                              </button>
                              <button
                                className="modern-action-btn modern-action-btn-danger"
                                onClick={() => handleApproveArticle(row.ArticleId, 'Reject')}
                                title="Reject Article"
                                disabled={selectedRows.length > 0}
                                style={{ 
                                  cursor: 'pointer', 
                                  zIndex: 1000,
                                  width: '28px',
                                  height: '28px',
                                  fontSize: '12px',
                                  padding: '0',
                                  backgroundColor: '#ef4444',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '4px',
                                  opacity: selectedRows.length > 0 ? 0.5 : 1
                                }}
                              >
                                <FaTimesCircle />
                          </button>
                            </>
                          )}
                            </>
                          )}
                        </div>
                    </td>
                  </tr>
                    );
                  })
              )}
            </tbody>
          </table>
      </div>
        </div>
        
        {/* Modern Pagination */}
        <div className="modern-pagination">
          <button 
            className="modern-pagination-btn"
            onClick={() => setCurrentPage(currentPage - 1)} 
            disabled={currentPage === 1}
          >
            &laquo;
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button 
              key={i + 1} 
              className={`modern-pagination-btn ${currentPage === i + 1 ? 'active' : ''}`}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          <button 
            className="modern-pagination-btn"
            onClick={() => setCurrentPage(currentPage + 1)} 
            disabled={currentPage === totalPages}
          >
            &raquo;
          </button>
        </div>
      </div>
      {/* Modals and other components remain unchanged */}
      <ArticleParcelViewModal
        open={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        rowData={selectedRow}
        columnDefinitions={columnDefinitions}
        onSave={handleSaveRowDetails}
        readOnly={true}
        userRole={userRole}
      />
      <ArticleParcelViewModal
        open={excelModalOpen}
        onClose={() => { 
          setExcelModalOpen(false); 
          setEditingRow(null); 
        }}
        columnDefinitions={columnDefinitions}
        excelMode={true}
        onSave={editingRow ? handleSaveRowDetails : handleSaveArticleRows}
        rowData={editingRow}
        isEdit={!!editingRow}
        readOnly={false}
        userRole={userRole}
      />

      <ArticleParcelViewModal
        open={excelViewModalOpen}
        onClose={() => setExcelViewModalOpen(false)}
        columnDefinitions={columnDefinitions}
        excelMode={true}
        rowsData={excelViewRow}
        readOnly={true}
        userRole={userRole}
      />

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="modal show" style={{ display: 'block', background: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-danger text-white">
                <h5 className="modal-title">
                  <FaTrash style={{ marginRight: '8px' }} />
                  {currentTabState === 7 ? 'Confirm Permanent Delete' : 'Confirm Delete'}
                </h5>
                <button type="button" className="btn-close btn-close-white" aria-label="Close" onClick={cancelDeleteRow}></button>
              </div>
              <div className="modal-body">
                <div className="alert alert-warning">
                  <FaInfoCircle style={{ marginRight: '8px' }} />
                  <strong>Warning:</strong> 
                  {currentTabState === 7 
                    ? ' This action cannot be undone. The article will be permanently removed from the system.'
                    : ' This action will move the article to the deleted tab where it can be restored or permanently deleted later.'
                  }
                </div>
                <p>
                  {currentTabState === 7 
                    ? 'Are you sure you want to permanently delete this article?'
                    : 'Are you sure you want to delete this article?'
                  }
                </p>
                {rowToDelete && (
                  <div className="card">
                    <div className="card-body">
                      <h6 className="card-title">Article Details:</h6>
                      <ul className="list-unstyled mb-0">
                        <li><strong>MC Code:</strong> {rowToDelete["MC_CODE"] || 'N/A'}</li>
                        <li><strong>Article Description:</strong> {rowToDelete["ARTICLE_DESCRIPTION"] || 'N/A'}</li>
                        <li><strong>Vendor Code:</strong> {rowToDelete["VND_CD"] || 'N/A'}</li>
                        <li><strong>Vendor Name:</strong> {rowToDelete["VND_NM"] || 'N/A'}</li>
                        <li><strong>Status:</strong> {rowToDelete["STATUS"] || 'N/A'}</li>
                        {currentTabState === 7 && rowToDelete.deletedAt && (
                          <li><strong>Deleted On:</strong> {new Date(rowToDelete.deletedAt).toLocaleString()}</li>
                        )}
                  </ul>
                    </div>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={cancelDeleteRow}>
                  <FaTimesCircle style={{ marginRight: '4px' }} />
                  Cancel
                </button>
                <button type="button" className="btn btn-danger" onClick={currentTabState === 7 ? confirmPermanentDelete : confirmDeleteRow}>
                  <FaTrash style={{ marginRight: '4px' }} />
                  {currentTabState === 7 ? 'Delete Permanently' : 'Delete Article'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Approval Confirmation Modal */}
      {showApprovalModal && (
        <div className="modal show" style={{ display: 'block', background: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Send to Approved</h5>
                <button type="button" className="btn-close" aria-label="Close" onClick={cancelBatchApproval}></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to send <strong>{selectedRows.length}</strong> article(s) to approved?</p>
                <div className="alert alert-info">
                  <strong>Selected Articles:</strong>
                  <ul className="mb-0 mt-2">
                    {paginatedData
                      .filter(row => selectedRows.includes(row["ArticleId"]))
                      .slice(0, 5) // Show only first 5 for brevity
                      .map((row, index) => (
                        <li key={`${row["ArticleId"]}-${index}`}>
                          <strong>MC Code:</strong> {row["MC_CODE"]} | 
                          <strong> Article:</strong> {row["ARTICLE_DESCRIPTION"]} | 
                          <strong> Vendor:</strong> {row["VND_NM"]}
                        </li>
                      ))}
                    {selectedRows.length > 5 && (
                      <li><em>... and {selectedRows.length - 5} more articles</em></li>
                    )}
                  </ul>
                </div>
                <div className="alert alert-warning">
                  <i className="bi bi-exclamation-triangle"></i>
                  <strong>Note:</strong> Once sent to approved, the status will be updated to "Approved" and these articles will be available for review by approvers.
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={cancelBatchApproval}>Cancel</button>
                <button type="button" className="btn btn-primary" onClick={confirmBatchApproval}>
                  <FiPlay style={{marginRight:8}}/>
                  Send to Approved
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Image Gallery Modal */}
      {imageGalleryModal && (
        <div className="modal show" style={{ display: 'block', background: 'rgba(0,0,0,0.8)' }} tabIndex="-1">
          <div className="modal-dialog modal-xl modal-dialog-centered">
            <div className="modal-content" style={{ background: 'transparent', border: 'none' }}>
              <div className="modal-header" style={{ background: 'transparent', border: 'none', justifyContent: 'flex-end' }}>
                <button 
                  type="button" 
                  className="btn-close btn-close-white" 
                  aria-label="Close" 
                  onClick={() => setImageGalleryModal(false)}
                  style={{ fontSize: '1.5rem' }}
                ></button>
              </div>
              <div className="modal-body text-center p-0">
                {selectedImages.length > 0 && (
                  <div style={{ position: 'relative' }}>
                    {/* Main Image */}
                    <img
                      src={selectedImages[currentImageIndex]}
                      alt={`Image ${currentImageIndex + 1}`}
                      style={{
                        maxWidth: '100%',
                        maxHeight: '70vh',
                        objectFit: 'contain',
                        borderRadius: '8px',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
                      }}
                      onError={(e) => {
                        e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik0xNiA4QzE4LjIwOTEgOCAyMCAxMC4yMDkxIDIwIDEyQzIwIDEzLjc5MDkgMTguMjA5MSAxNiAxNiAxNkMxMy43OTA5IDE2IDEyIDEzLjc5MDkgMTIgMTJDMTIgMTAuMjA5MSAxMy43OTA5IDggMTYgOFoiIGZpbGw9IiM5OTkiLz4KPHBhdGggZD0iTTI0IDI0QzI0IDI2LjIwOTEgMjIuMjA5MSAyOCAyMCAyOEgxMkM5Ljc5MDkgMjggOCAyNi4yMDkxIDggMjRWMjBDOCAxNy43OTA5IDkuNzkwOSAxNiAxMiAxNkgyMEMyMi4yMDkxIDE2IDI0IDE3Ljc5MDkgMjQgMjBWMjRaIiBmaWxsPSIjOTk5Ii8+Cjwvc3ZnPgo=';
                      }}
                    />
                    
                    {/* Navigation Arrows */}
                    {selectedImages.length > 1 && (
                      <>
                        <button
                          className="btn btn-light position-absolute"
                          style={{
                            left: '20px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            borderRadius: '50%',
                            width: '50px',
                            height: '50px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.5rem',
                            zIndex: 1000
                          }}
                          onClick={() => setCurrentImageIndex(prev => prev === 0 ? selectedImages.length - 1 : prev - 1)}
                        >
                          ‹
                        </button>
                        <button
                          className="btn btn-light position-absolute"
                          style={{
                            right: '20px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            borderRadius: '50%',
                            width: '50px',
                            height: '50px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.5rem',
                            zIndex: 1000
                          }}
                          onClick={() => setCurrentImageIndex(prev => prev === selectedImages.length - 1 ? 0 : prev + 1)}
                        >
                          ›
                        </button>
                      </>
                    )}
                  </div>
                )}
                
                {/* Thumbnail Navigation */}
                {selectedImages.length > 1 && (
                  <div className="mt-3" style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    {selectedImages.map((img, index) => (
                      <img
                        key={`thumb-${index}-${img.substring(0, 20)}`}
                        src={img}
                        alt={`Thumbnail ${index + 1}`}
                        style={{
                          width: '60px',
                          height: '60px',
                          objectFit: 'cover',
                          borderRadius: '4px',
                          border: index === currentImageIndex ? '3px solid #007bff' : '1px solid #ddd',
                          cursor: 'pointer',
                          opacity: index === currentImageIndex ? 1 : 0.7
                        }}
                        onClick={() => setCurrentImageIndex(index)}
                        onError={(e) => {
                          e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik0xNiA4QzE4LjIwOTEgOCAyMCAxMC4yMDkxIDIwIDEyQzIwIDEzLjc5MDkgMTguMjA5MSAxNiAxNiAxNkMxMy43OTA5IDE2IDEyIDEzLjc5MDkgMTIgMTJDMTIgMTAuMjA5MSAxMy43OTA5IDggMTYgOFoiIGZpbGw9IiM5OTkiLz4KPHBhdGggZD0iTTI0IDI0QzI0IDI2LjIwOTEgMjIuMjA5MSAyOCAyMCAyOEgxMkM5Ljc5MDkgMjggOCAyNi4yMDkxIDggMjRWMjBDOCAxNy43OTA5IDkuNzkwOSAxNiAxMiAxNkgyMEMyMi4yMDkxIDE2IDI0IDE3Ljc5MDkgMjQgMjBWMjRaIiBmaWxsPSIjOTk5Ii8+Cjwvc3ZnPgo=';
                        }}
                      />
                    ))}
                  </div>
                )}
                
                {/* Image Counter */}
                {selectedImages.length > 1 && (
                  <div className="mt-2 text-white">
                    <small>
                      {currentImageIndex + 1} of {selectedImages.length}
                    </small>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}


    </div>
  );
};

export default ArticleParcel; 