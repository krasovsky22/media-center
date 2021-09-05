import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause } from '@fortawesome/free-solid-svg-icons';
import { faPlayCircle } from '@fortawesome/free-regular-svg-icons';

const Play = ({ ...rest }) => {
  return <FontAwesomeIcon icon={faPlay} {...rest} />;
};

const CirclePlay = ({ ...rest }) => {
  return <FontAwesomeIcon icon={faPlayCircle} {...rest} />;
};

const Pause = ({ ...rest }) => {
  return <FontAwesomeIcon icon={faPause} {...rest} />;
};

export default {
  Play,
  Pause,
  CirclePlay,
};
