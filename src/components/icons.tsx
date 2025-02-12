import React from 'react';
import { FontAwesomeIcon, FontAwesomeIconProps } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

// Free Solid Icons
import { 
  faSearchDollar, 
  faShieldAlt, 
  faChartLine, 
  faKey, 
  faBolt,  
  faBalanceScale, 
  faUserTie, 
  faFileContract, 
  faPiggyBank, 
  faClipboardList,
  faHeart,
  faStar, 
  faPlus,
  faCopy,
  faMedal,
  faAtom,
  faMoneyBill1,
  faTriangleExclamation,
  faRobot,
  faIdCard,
  faBell,
  faInfoCircle,
  faChevronDown,
  faChevronUp,
  faFileUpload,
  faFileMedical,
  faHammer,
  faHelmetSafety,
  faMagnifyingGlassChart,
  faListCheck,
  faEye,
  faRocket   // Used as a placeholder for Warpcast
} from '@fortawesome/free-solid-svg-icons';

// Free Brands Icons for social media
import { 
  faDiscord, 
  faInstagram, 
  faLinkedin, 
  faTwitter 
} from '@fortawesome/free-brands-svg-icons';

// Extend FontAwesomeIconProps to create our own IconProps (excluding the 'icon' property)
interface IconProps extends Omit<FontAwesomeIconProps, 'icon'> {}

// ========================
// Exporting Solid Icons
// ========================
export const AnalysisIcon: React.FC<IconProps> = (props) => (
  <FontAwesomeIcon icon={faSearchDollar} {...props} />
);

export const ShieldIcon: React.FC<IconProps> = (props) => (
  <FontAwesomeIcon icon={faShieldAlt} {...props} />
);

export const GraphIcon: React.FC<IconProps> = (props) => (
  <FontAwesomeIcon icon={faChartLine} {...props} />
);

export const KeyIcon: React.FC<IconProps> = (props) => (
  <FontAwesomeIcon icon={faKey} {...props} />
);

export const LightningIcon: React.FC<IconProps> = (props) => (
  <FontAwesomeIcon icon={faBolt} {...props} />
);

export const BalanceIcon: React.FC<IconProps> = (props) => (
  <FontAwesomeIcon icon={faBalanceScale} {...props} />
);

export const AdvisorIcon: React.FC<IconProps> = (props) => (
  <FontAwesomeIcon icon={faUserTie} {...props} />
);

export const ContractIcon: React.FC<IconProps> = (props) => (
  <FontAwesomeIcon icon={faFileContract} {...props} />
);

export const SavingsIcon: React.FC<IconProps> = (props) => (
  <FontAwesomeIcon icon={faPiggyBank} {...props} />
);

export const ChecklistIcon: React.FC<IconProps> = (props) => (
  <FontAwesomeIcon icon={faClipboardList} {...props} />
);

export const HeartIcon: React.FC<IconProps> = (props) => (
  <FontAwesomeIcon icon={faHeart} {...props} />
);

export const StarIcon: React.FC<IconProps> = (props) => (
  <FontAwesomeIcon icon={faStar} {...props} />
);

export const PlusIcon: React.FC<IconProps> = (props) => (
  <FontAwesomeIcon icon={faPlus} {...props} />
);

export const CopyIcon: React.FC<IconProps> = (props) => (
  <FontAwesomeIcon icon={faCopy} {...props} />
);

export const MedalIcon: React.FC<IconProps> = (props) => (
  <FontAwesomeIcon icon={faMedal} {...props} />
);

export const AtomIcon: React.FC<IconProps> = (props) => (
  <FontAwesomeIcon icon={faAtom} {...props} />
);

export const MoneyIcon: React.FC<IconProps> = (props) => (
  <FontAwesomeIcon icon={faMoneyBill1} {...props} />
);

export const Alert: React.FC<IconProps> = (props) => (
  <FontAwesomeIcon icon={faTriangleExclamation} {...props} />
);

export const Robot: React.FC<IconProps> = (props) => (
  <FontAwesomeIcon icon={faRobot} {...props} />
);

export const IdCard: React.FC<IconProps> = (props) => (
  <FontAwesomeIcon icon={faIdCard} {...props} />
);

export const Bell: React.FC<IconProps> = (props) => (
  <FontAwesomeIcon icon={faBell} {...props} />
);

export const Info: React.FC<IconProps> = (props) => (
  <FontAwesomeIcon icon={faInfoCircle} {...props} />
);

export const ChevronDownIcon: React.FC<IconProps> = (props) => (
  <FontAwesomeIcon icon={faChevronDown} {...props} />
);

export const ChevronUpIcon: React.FC<IconProps> = (props) => (
  <FontAwesomeIcon icon={faChevronUp} {...props} />
);

export const FileUpload: React.FC<IconProps> = (props) => (
  <FontAwesomeIcon icon={faFileUpload} {...props} />
);

export const Heal: React.FC<IconProps> = (props) => (
  <FontAwesomeIcon icon={faFileMedical} {...props} />
);

export const Build: React.FC<IconProps> = (props) => (
  <FontAwesomeIcon icon={faHammer} {...props} />
);

export const Scout: React.FC<IconProps> = (props) => (
  <FontAwesomeIcon icon={faMagnifyingGlassChart} {...props} />
);

export const Mine: React.FC<IconProps> = (props) => (
  <FontAwesomeIcon icon={faHelmetSafety} {...props} />
);

export const CheckList: React.FC<IconProps> = (props) => (
  <FontAwesomeIcon icon={faListCheck} {...props} />
);

export const Eye: React.FC<IconProps> = (props) => (
  <FontAwesomeIcon icon={faEye} {...props} />
);

// ========================
// Exporting Social Media Icons (Brands)
// ========================
export const DiscordIcon: React.FC<IconProps> = (props) => (
  <FontAwesomeIcon icon={faDiscord as IconProp} {...props} />
);

export const InstagramIcon: React.FC<IconProps> = (props) => (
  <FontAwesomeIcon icon={faInstagram as IconProp} {...props} />
);

export const LinkedInIcon: React.FC<IconProps> = (props) => (
  <FontAwesomeIcon icon={faLinkedin as IconProp} {...props} />
);

export const TwitterIcon: React.FC<IconProps> = (props) => (
  <FontAwesomeIcon icon={faTwitter as IconProp} {...props} />
);

// ========================
// Placeholder for Warpcast (Farcaster)
// ========================
export const WarpcastIcon: React.FC<IconProps> = (props) => (
  <FontAwesomeIcon icon={faRocket as IconProp} {...props} />
);
