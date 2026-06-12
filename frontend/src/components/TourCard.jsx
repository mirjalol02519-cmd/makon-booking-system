import React from 'react';
import { getImageUrl } from '../config';

function TourCard({ tour, onClick }) {
    const imgUrl = getImageUrl(tour.image);

    return (
        <div 
            className="tour-card" 
            onClick={onClick}
            style={{
                width: '100%',
                maxWidth: '390px', 
                margin: '0 auto 16px', 
                display: 'block',
                cursor: 'pointer'
            }}
        >
            {imgUrl ? (
                <img 
                    src={imgUrl} 
                    alt={tour.title} 
                    className="tl-featured-img" 
                    style={{
                        width: '100%',
                        height: '280px', 
                        objectFit: 'cover',
                        borderRadius: '24px', 
                        display: 'block'
                    }}
                />
            ) : (
                <div 
                    className="tl-featured-img" 
                    style={{
                        width: '100%',
                        height: '280px',
                        background: '#22222E',
                        display: 'flex',
                        alignItems: 'center', 
                        justifyContent: 'center',
                        fontSize: '32px',
                        borderRadius: '24px'
                    }}
                >
                    🏔
                </div>
            )}
            
            <div className="tour-info" style={{ padding: '12px 4px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '6px', color: '#fff' }}>
                    {tour.title}
                </h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <p style={{ color: '#C8A96E', fontWeight: '600', fontSize: '15px', margin: 0 }}>
                        {tour.price ? Number(tour.price).toLocaleString('uz-UZ') : 0} so'm
                    </p>
                    <p style={{ color: '#7A7A82', fontSize: '12px', margin: 0 }}>
                        ⏱ {tour.duration_days} kun
                    </p>
                </div>
            </div>
        </div>
    );
}

export default TourCard;