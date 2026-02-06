import React from "react";
import { Link } from "react-router-dom";
import "./Sensor.css";

// Import icons from assets
import imgCore from "../../../assets/images/sensor/core.png";
import imgProblem from "../../../assets/images/sensor/problem-statement.png";
import imgHK from "../../../assets/images/sensor/hong-kong.png";
import imgMarket from "../../../assets/images/sensor/market-opportunity.png";
import imgDrivers from "../../../assets/images/sensor/drivers.png";
import imgChallenges from "../../../assets/images/sensor/challenges.png";
import imgFeatures from "../../../assets/images/sensor/features.png";
import imgCompetitors from "../../../assets/images/sensor/competitor-analysis.png";
import imgDifferentiators from "../../../assets/images/sensor/differentiators.png";
import imgManufacturers from "../../../assets/images/sensor/manufacturer.png";
import imgPartnerships from "../../../assets/images/sensor/partnership.png";
import imgRoadmap from "../../../assets/images/sensor/roadmap.png";
import imgMonetization from "../../../assets/images/sensor/monetisation.png";
import imgNextSteps from "../../../assets/images/sensor/future.png";

const sensorSections = [
  { title: "Core Promise", path: "/solutions/sensor/core", icon: imgCore },
  { title: "Problem Statement", path: "/solutions/sensor/problem", icon: imgProblem },
  { title: "HK Context", path: "/solutions/sensor/hk-context", icon: imgHK },
  { title: "Market Opportunity", path: "/solutions/sensor/market", icon: imgMarket },
  { title: "Key Drivers", path: "/solutions/sensor/drivers", icon: imgDrivers },
  { title: "Challenges", path: "/solutions/sensor/challenges", icon: imgChallenges },
  { title: "Key Features", path: "/solutions/sensor/features", icon: imgFeatures },
  { title: "Competitor Analysis", path: "/solutions/sensor/competitors", icon: imgCompetitors },
  { title: "Differentiators", path: "/solutions/sensor/differentiators", icon: imgDifferentiators },
  { title: "Manufacturers", path: "/solutions/sensor/manufacturers", icon: imgManufacturers },
  { title: "Partnerships", path: "/solutions/sensor/partnerships", icon: imgPartnerships },
  { title: "Product Roadmap", path: "/solutions/sensor/roadmap", icon: imgRoadmap },
  { title: "Monetisation", path: "/solutions/sensor/monetization", icon: imgMonetization },
  { title: "Next Steps", path: "/solutions/sensor/next-steps", icon: imgNextSteps },
];

export default function SensorIdeaPage() {
  return (
    <div className="sensor-page">
      <div className="content-wrapper">

        {/* Header */}
        <div className="header-card">
          <h1 className="main-title">
            Safety for aging loved ones — without wearables, buttons or effort
          </h1>
          <p className="main-subtitle">
            An always-on, non-invasive safety device designed for Hong Kong homes, detecting falls, distress calls, and abnormal inactivity automatically — even in noisy environments.
          </p>
        </div>

        {/* Navigation Grid */}
        <div className="nav-grid">
          {sensorSections.map((section, index) => (
            <Link to={section.path} key={index} className="nav-card">
              {section.icon && (
                <img 
                  src={section.icon} 
                  alt={section.title} 
                  className="nav-card-icon" 
                />
              )}
              <span className="nav-card-title">{section.title}</span>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}
