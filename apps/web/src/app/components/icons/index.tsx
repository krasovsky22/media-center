import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlay,
  faPause,
  faStar as faStarFilled,
  faMoon,
  faSun,
} from '@fortawesome/free-solid-svg-icons';
import { faPlayCircle, faStar } from '@fortawesome/free-regular-svg-icons';

const Play = ({ ...rest }) => {
  return <FontAwesomeIcon icon={faPlay} {...rest} />;
};

const CirclePlay = ({ ...rest }) => {
  return <FontAwesomeIcon icon={faPlayCircle} {...rest} />;
};

const Pause = ({ ...rest }) => {
  return <FontAwesomeIcon icon={faPause} {...rest} />;
};

const Star = ({ ...rest }) => {
  return <FontAwesomeIcon icon={faStar} {...rest} />;
};

const StarFilled = ({ ...rest }) => {
  return <FontAwesomeIcon icon={faStarFilled} {...rest} />;
};

const Moon = ({ ...rest }) => {
  return <FontAwesomeIcon icon={faMoon} {...rest} />;
};

const Sun = ({ ...rest }) => {
  return <FontAwesomeIcon icon={faSun} {...rest} />;
};

export default {
  Star,
  Play,
  Sun,
  Moon,
  Pause,
  StarFilled,
  CirclePlay,
};
