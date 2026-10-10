import React, { useState } from "react";

export default function EnergyCards() {
  const cardBaseStyle = {
    borderRadius: 0,
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
    cursor: "pointer",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
    height: "169px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    textAlign: "center",
    padding: "1rem",
  };

  const cardHoverStyle = {
    transform: "translateY(-3px)",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
  };

  const valueNumberStyle = {
    fontSize: "1.5rem",
    fontWeight: "bold",
    lineHeight: 1.2,
  };

  const valueUnitStyle = {
    fontSize: "0.9rem",
    fontWeight: "500",
    marginBottom: "0.5rem",
  };

  const labelStyle = {
    fontSize: "0.8rem",
    color: "#1a73e8",
    fontWeight: "500",
  };

  const cards = [
    {
      img: "/ord/file:^UI/react-app/images/charger.png",
      alt: "savings",
      value: "7.4",
      unit: "kWh",
      label: "Daily Energy Savings",
    },
    {
      img: "/ord/file:^UI/react-app/images/energy_program_saving.png",
      alt: "consumption",
      value: "1.4",
      unit: "kWh",
      label: "Daily Energy Consumption",
    },
    {
      img: "/ord/file:^UI/react-app/images/charger.png",
      alt: "monthly savings",
      value: "14.5",
      unit: "kWh",
      label: "Monthly Energy Savings",
    },
    {
      img: "/ord/file:^UI/react-app/images/energy_program_saving.png",
      alt: "monthly consumption",
      value: "78.4",
      unit: "kWh",
      label: "Monthly Energy Consumption",
    },
  ];

  const [hoverIndex, setHoverIndex] = useState(null);

  return (
    <div className="row g-2">
      {cards.map((card, index) => {
        const isHovered = hoverIndex === index;
        return (
          <div className="col-6" key={index}>
            <div
              style={{
                ...cardBaseStyle,
                ...(isHovered ? cardHoverStyle : {}),
              }}
              onMouseEnter={() => setHoverIndex(index)}
              onMouseLeave={() => setHoverIndex(null)}
            >
              <div style={{ marginBottom: "1rem" }}>
                <img src={card.img} alt={card.alt} width={24} height={24} />
              </div>
              <div style={valueNumberStyle}>{card.value}</div>
              <div style={valueUnitStyle}>{card.unit}</div>
              <div style={labelStyle}>{card.label}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}





