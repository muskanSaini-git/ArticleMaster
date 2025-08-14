import React from 'react';
import { FiGrid, FiEye, FiEdit, FiPackage, FiCalendar, FiUser, FiTag } from 'react-icons/fi';
import { FaEye, FaEdit, FaCheckCircle, FaTimesCircle, FaClock } from 'react-icons/fa';
import ActionButtons from './ActionButtons';
import StatusBadge from './StatusBadge';
import './GridView.css';

const GridView = ({ 
  data = [], 
  onView, 
  onEdit, 
  disabled = false,
  selectedItems = new Set(),
  handleSelectItem,
  handleImageError = () => {}
}) => {
  if (!data || data.length === 0) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
        background: '#ffffff',
        border: '1px solid #d1d5db',
        fontSize: '12px'
      }}>
        <h3 style={{ margin: 0, fontSize: '14px' }}>No items found</h3>
      </div>
    );
  }

  return (
    <div className="grid-view-container">
      <div className="grid-cards">
        {data.map((item, idx) => {
          const imagesArr = item.images || [];
          const isSelected = selectedItems.has(item.ArticleId);
              
              return (
                <div 
                  key={idx} 
                  className={`grid-card ${isSelected ? 'selected' : ''}`}
                  style={{
                    position: 'relative',
                    background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                    border: isSelected ? '2px solid #2563eb' : '1px solid #d1d5db',
                    borderLeft: isSelected ? '4px solid #2563eb' : '3px solid #e5e7eb',
                    cursor: 'pointer',
                    minHeight: '120px',
                    display: 'flex',
                    flexDirection: 'column',
                    fontSize: '11px',
                    borderRadius: '0 8px 8px 0',
                    boxShadow: isSelected ? '0 2px 8px rgba(37, 99, 235, 0.2)' : '0 1px 3px rgba(0, 0, 0, 0.05)'
                  }}
                  onClick={() => handleSelectItem && handleSelectItem(item.ArticleId)}
                >
                  {/* Selection Checkbox */}
                  {handleSelectItem && (
                    <div className="card-checkbox" style={{
                      position: 'absolute',
                      top: '4px',
                      left: '4px',
                      zIndex: 10
                    }}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => {
                          e.stopPropagation();
                          handleSelectItem(item.ArticleId);
                        }}
                        style={{ 
                          width: '12px', 
                          height: '12px',
                          cursor: 'pointer'
                        }}
                      />
                    </div>
                  )}

                  {/* Card Header */}
                  <div className="card-header" style={{
                    padding: '6px 8px',
                    background: 'linear-gradient(90deg, #f1f5f9 0%, #e2e8f0 100%)',
                    borderBottom: '1px solid #d1d5db',
                    position: 'relative'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}>
                      <div style={{
                        flex: 1,
                        minWidth: 0
                      }}>
                        <div style={{
                          fontSize: '10px',
                          fontWeight: '700',
                          color: '#111827',
                          marginBottom: '1px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px'
                        }}>{item.MC_CODE}</div>
                        <div style={{
                          fontSize: '9px',
                          fontWeight: '600',
                          color: '#6b7280',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          fontStyle: 'italic'
                        }}>{item.SEG} • {item.DIV}</div>
                      </div>
                      <StatusBadge status={item.STATUS} />
                    </div>
                    {/* Decorative corner */}
                    <div style={{
                      position: 'absolute',
                      top: '0',
                      right: '0',
                      width: '0',
                      height: '0',
                      borderStyle: 'solid',
                      borderWidth: '0 12px 12px 0',
                      borderColor: 'transparent #d1d5db transparent transparent'
                    }}></div>
                  </div>

                  {/* Card Images - Small Grid Layout */}
                  <div className="card-images" style={{
                    padding: '3px',
                    background: 'linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)',
                    minHeight: '40px',
                    position: 'relative'
                  }}>
                    {imagesArr.length > 0 ? (
                      <div className="image-grid" style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: '1px',
                        width: '100%',
                        height: '100%',
                        maxHeight: '40px'
                      }}>
                        {imagesArr.slice(0, 6).map((imageUrl, imgIdx) => (
                          <div key={imgIdx} style={{
                            position: 'relative',
                            overflow: 'hidden',
                            border: '1px solid #d1d5db',
                            aspectRatio: '1',
                            borderRadius: '2px'
                          }}>
                            <img
                              src={imageUrl}
                              alt={`Article Image ${imgIdx + 1}`}
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover'
                              }}
                              onError={e => { 
                                e.target.onerror = null; 
                                handleImageError(imageUrl, e.target);
                              }}
                            />
                          </div>
                        ))}
                        {imagesArr.length > 6 && (
                          <div style={{
                            position: 'relative',
                            border: '1px solid #d1d5db',
                            aspectRatio: '1',
                            background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontSize: '7px',
                            fontWeight: '700',
                            borderRadius: '2px'
                          }}>
                            +{imagesArr.length - 6}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div style={{
                        height: '100%',
                        background: 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px solid #d1d5db',
                        minHeight: '30px',
                        borderRadius: '4px',
                        position: 'relative'
                      }}>
                        <div style={{
                          textAlign: 'center',
                          color: '#9ca3af',
                          fontSize: '8px',
                          fontWeight: '600'
                        }}>
                          <FiPackage style={{ fontSize: '8px', marginBottom: '1px', color: '#d1d5db' }} />
                          <div style={{ fontSize: '7px' }}>
                            <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2ZhZmFmYSIvPjxjaXJjbGUgY3g9IjUwIiBjeT0iMzUiIHI9IjE1IiBmaWxsPSIjZGRlNGY3Ii8+PHBhdGggZD0iTTM1IDQ1aDNsLTItNmgydjZ6bTQgMGgzbC0yLTZoMnY2eiIgZmlsbD0iI2RkZTRmNyIvPjx0ZXh0IHg9IjUwIiB5PSI3MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjgiIGZpbGw9IiM5Y2EzYWYiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkltYWdlPC90ZXh0Pjwvc3ZnPg==" alt="Dummy Image" style={{ width: '16px', height: '16px', borderRadius: '2px' }} />
                          </div>
                        </div>
                        {/* Decorative dots */}
                        <div style={{
                          position: 'absolute',
                          top: '2px',
                          right: '2px',
                          display: 'flex',
                          gap: '1px'
                        }}>
                          <div style={{ width: '2px', height: '2px', background: '#d1d5db', borderRadius: '50%' }}></div>
                          <div style={{ width: '2px', height: '2px', background: '#d1d5db', borderRadius: '50%' }}></div>
                          <div style={{ width: '2px', height: '2px', background: '#d1d5db', borderRadius: '50%' }}></div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Card Content */}
                  <div className="card-content" style={{
                    padding: '4px 8px',
                    background: '#ffffff',
                    flex: 1,
                    position: 'relative'
                  }}>
                    <div style={{
                      marginBottom: '4px'
                    }}>
                      <div style={{
                        fontSize: '10px',
                        fontWeight: '700',
                        color: '#111827',
                        marginBottom: '2px',
                        textTransform: 'capitalize',
                        borderBottom: '1px solid #f1f5f9',
                        paddingBottom: '2px'
                      }}>{item.MAJ_CAT_NM}</div>
                      
                      {/* Details Grid */}
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '2px',
                        fontSize: '8px',
                        marginTop: '3px'
                      }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '2px'
                        }}>
                          <span style={{
                            color: '#6b7280',
                            fontWeight: '600',
                            minWidth: '20px'
                          }}>ID:</span>
                          <span style={{
                            color: '#111827',
                            fontWeight: '700',
                            fontSize: '7px'
                          }}>{item.ArticleId || 'N/A'}</span>
                        </div>
                        
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '2px'
                        }}>
                          <span style={{
                            color: '#6b7280',
                            fontWeight: '600',
                            minWidth: '20px'
                          }}>SEG:</span>
                          <span style={{
                            color: '#111827',
                            fontWeight: '700',
                            fontSize: '7px'
                          }}>{item.SEG || 'N/A'}</span>
                        </div>
                        
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '2px'
                        }}>
                          <span style={{
                            color: '#6b7280',
                            fontWeight: '600',
                            minWidth: '20px'
                          }}>DIV:</span>
                          <span style={{
                            color: '#111827',
                            fontWeight: '700',
                            fontSize: '7px'
                          }}>{item.DIV || 'N/A'}</span>
                        </div>
                        
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '2px'
                        }}>
                          <span style={{
                            color: '#6b7280',
                            fontWeight: '600',
                            minWidth: '20px'
                          }}>IMG:</span>
                          <span style={{
                            color: '#111827',
                            fontWeight: '700',
                            fontSize: '7px'
                          }}>{imagesArr.length}</span>
                        </div>
                      </div>
                      
                      {/* Description */}
                      <div style={{
                        marginTop: '3px',
                        padding: '2px 4px',
                        background: '#f8fafc',
                        border: '1px solid #e5e7eb',
                        borderRadius: '2px'
                      }}>
                        <div style={{
                          fontSize: '8px',
                          fontWeight: '600',
                          color: '#4b5563',
                          lineHeight: '1.2',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          fontStyle: 'italic',
                          textAlign: 'center'
                        }}>{item.ARTICLE_DESCRIPTION}</div>
                      </div>
                    </div>
                    {/* Bottom accent line */}
                    <div style={{
                      position: 'absolute',
                      bottom: '0',
                      left: '8px',
                      right: '8px',
                      height: '1px',
                      background: 'linear-gradient(90deg, transparent 0%, #e5e7eb 50%, transparent 100%)'
                    }}></div>
                  </div>

                  {/* Card Actions */}
                  <div className="card-actions" style={{
                    padding: '4px 8px',
                    borderTop: '1px solid #d1d5db',
                    background: 'linear-gradient(90deg, #f9fafb 0%, #f3f4f6 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px',
                    borderRadius: '0 0 8px 0'
                  }}>
                    <ActionButtons 
                      onView={onView}
                      onEdit={onEdit}
                      item={item}
                      disabled={disabled}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    };

export default GridView; 