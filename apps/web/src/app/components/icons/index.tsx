import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import { faPlayCircle } from '@fortawesome/free-regular-svg-icons';

const Play = ({ ...rest }) => {
  return <FontAwesomeIcon icon={faPlay} {...rest} />;
};

const CirclePlay =  ({ ...rest }) => {
  return <FontAwesomeIcon icon={faPlayCircle} {...rest} />;
};

export default {
  Play,
  CirclePlay
};
