# 📋 Article Data Structure Guide

## **🔧 Fixed Issues**

### **1. Image Loading Errors Resolved**
- **Problem**: `via.placeholder.com` URLs were failing with `net::ERR_NAME_NOT_RESOLVED`
- **Solution**: Replaced with working `picsum.photos` service
- **Result**: Images now load properly without errors

### **2. New Data Structure Support**
- **Added**: Support for new field names (FG_SEG, FG_DIV, MJ_CAT, etc.)
- **Maintained**: Backward compatibility with legacy field names
- **Enhanced**: Field mapping for seamless data conversion

## **📊 Data Structure**

### **Core Fields (New Structure)**
```json
{
  "FG_SEG": "APP",                    // FG Segment
  "FG_DIV": "KIDS",                   // FG Division  
  "SUB_DIV": "KB-SETS",               // Sub Division
  "MJ_CAT": "IB_B_SUIT_FS",          // Major Category
  "MC_CD": "113030110",               // MC Code
  "MC_DESC": "M_TEES_HS",            // MC Description
  "MACRO_MVGR": "Macro1",            // Macro MVGR
  "MICRO_MVGR": "Micro1",            // Micro MVGR
  "FAB_DIV": "Fabric1",              // Fabric Division
  "YARN_01": "YarnA",                // Yarn 01
  "YARN_02": "YarnB",                // Yarn 02
  "MAIN_MVGR": "MainMVGR",           // Main MVGR
  "WEAVE": "Weave1",                  // Weave
  "WEAVE_2": "Weave2",               // Weave 2
  "COMPOSITION": "Cotton",            // Composition
  "FINISH": "Matte",                  // Finish
  "CONSTRUCTION": "Construction1",    // Construction
  "GSM": "200",                       // GSM
  "WIDTH": "40",                      // Width
  "WIDTH_UOM": "cm",                 // Width Unit of Measure
  "COUNT": "10",                      // Count
  "WEIGHT_TYPE": "Light",             // Weight Type
  "ORIGINAL_MATERIAL_SOURCE": "Source1", // Material Source
  "SHADE": "Blue",                    // Shade
  "LCR_NON_LCR": "LCR",              // LCR Non-LCR
  "NECK": "Round",                    // Neck
  "NECK_TYPE": "Type1",              // Neck Type
  "NECK_SIZE": "M",                   // Neck Size
  "PLACKET": "Placket1",             // Placket
  "FATHER_BELT": "Yes",              // Father Belt
  "BELT_DESIGN": "Belt1",            // Belt Design
  "BLT_SIZE": "Medium",              // Belt Size
  "SLEEVE": "Short",                  // Sleeve
  "BTM_FOLD": "Yes",                  // Bottom Fold
  "BOTTOM_OPEN_WIDTH_INC": "5",      // Bottom Open Width
  "SET": "Set1",                      // Set
  "FO_STYLE": "Style1",              // Front Style
  "POCKET_TYPE": "Side",             // Pocket Type
  "NO_OF_POCKET": "2",               // Number of Pockets
  "FIT": "Slim",                      // Fit
  "PATTERN": "Solid",                 // Pattern
  "LENGTH": "Regular",                // Length
  "MEASUREMENT_LENGTH_INCH": "30",    // Length in Inches
  "DRAWCORD": "Yes",                  // Drawcord
  "DRAWCORD_STYLE": "StyleA",        // Drawcord Style
  "DRAWCORD_LOOP": "Loop1",          // Drawcord Loop
  "BUTTON": "Plastic",                // Button
  "BUTTON_COLOR": "Black",            // Button Color
  "ZIP": "Metal",                     // Zip
  "ZIP_COL": "Silver",               // Zip Color
  "PRINT_TYPE": "Screen",             // Print Type
  "PRINT_PLACEMENT": "Front",        // Print Placement
  "PRINT_STYLE": "StyleB",           // Print Style
  "PATCHES": "Yes",                   // Patches
  "PATCH_TYPE": "Type2",             // Patch Type
  "EMBROIDERY": "Yes",                // Embroidery
  "EMB_TYPE": "Emb1",                 // Embroidery Type
  "PLACEMENT": "Left",                // Placement
  "ADD_ACC1": "Accessory1",          // Additional Accessory
  "WASH": "Machine",                  // Wash
  "WASH_COLOR": "White",              // Wash Color
  "CLR": "Red",                       // Color
  "SIZE": "L",                        // Size
  "MRP": "1000",                      // MRP
  "SEG": "SegmentX",                  // Segment
  "ARTICLE_TYPE": "TypeX",            // Article Type
  "BUYING_TYPE": "Retail",            // Buying Type
  "PD": "PD1",                        // PD Date
  "Images": [                          // Images Array
    "https://picsum.photos/150/150?random=1",
    "https://picsum.photos/150/150?random=2"
  ]
}
```

## **🚀 How to Use**

### **1. Load Sample Data**
- Click **"Load Sample Data"** button in the modal
- This will populate the form with working sample data
- All images will load properly without errors

### **2. Import JSON Data**
- Use the **"Type JSON"** button to paste your data
- Copy the structure from `sample_data.json`
- Modify values as needed for your articles

### **3. Upload Excel File**
- Use **"Upload Excel"** button for bulk data
- Ensure headers match the expected column names
- Download template first to see required format

## **🔄 Field Mapping**

### **New to Legacy Field Mapping**
```javascript
// New Structure → Legacy Structure
FG_SEG → SEG
FG_DIV → DIV  
MJ_CAT → MAJ_CAT_NM
MC_CD → MC_CODE
YARN_01 → YARN
WEAVE → FAB_WEAVE
WEAVE_2 → FAB2
CONSTRUCTION → FAB_STYLE
FINISH → FAB_SUB_STYLE
LCR_NON_LCR → LYCRA
WEIGHT_TYPE → OUNZ
NECK → COLLAR
NECK_TYPE → NECK_BAND_STYLE
NECK_SIZE → COLLAR_SIZE
PLACKET → PLACKET_CHANGING
FATHER_BELT → BLT_MAIN_STYLE
BELT_DESIGN → SUB_STYLE_BLT
SLEEVE → SLEEVES_MAIN_STYLE
BTM_FOLD → BTFOLD
POCKET_TYPE → POCKET
BUTTON → FO_BTN_STYLE
DRAWCORD_STYLE → DC_SUB_STYLE
DRAWCORD_LOOP → DC_EDGE_LOOP
BUTTON_COLOR → BTN_MAIN_MVGR
ADD_ACC1 → ADD_ACC
CLR → COLOR1
ORIGINAL_MATERIAL_SOURCE → SOURCE
```

## **📸 Image Handling**

### **Working Image URLs**
- **Primary**: `https://picsum.photos/150/150?random=1`
- **Fallback**: Base64 encoded images
- **Legacy**: Server URLs (automatically converted)

### **Image Array Format**
```json
"Images": [
  "https://picsum.photos/150/150?random=1",
  "https://picsum.photos/150/150?random=2",
  "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ..."
]
```

## **✅ Validation Rules**

### **Required Fields**
- `FG_SEG` or `SEG`
- `FG_DIV` or `DIV`
- `SUB_DIV`
- `MJ_CAT` or `MAJ_CAT_NM`
- `MC_DESC`
- `MC_ST`
- `ART_CR_DATE`

### **Data Types**
- **Numeric**: `GSM`, `COUNT`, `MRP`, `WIDTH`
- **Date**: `ART_CR_DATE`, `PD`, `DATE`
- **String**: Most other fields
- **Array**: `Images`

## **🔧 Troubleshooting**

### **Common Issues**
1. **Images not loading**: Use `picsum.photos` URLs instead of `via.placeholder.com`
2. **Field validation errors**: Ensure required fields are filled
3. **Data type errors**: Check numeric fields contain valid numbers
4. **Date format**: Use YYYY-MM-DD format

### **Debug Tips**
- Check browser console for detailed error messages
- Use "Load Sample Data" button to test functionality
- Verify JSON structure matches the expected format
- Ensure all required fields are present

## **📁 Files**

- **`sample_data.json`**: Working sample data structure
- **`ArticleParcelViewModal.jsx`**: Updated component with new structure support
- **`DATA_STRUCTURE_README.md`**: This documentation file

## **🎯 Next Steps**

1. **Test the sample data** using the "Load Sample Data" button
2. **Customize the data** for your specific articles
3. **Upload via JSON** or Excel as needed
4. **Save and validate** the data structure

---

**✅ All image loading errors have been resolved!**
**✅ New data structure is fully supported!**
**✅ Backward compatibility maintained!**
