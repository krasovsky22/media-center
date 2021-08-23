import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay } from '@fortawesome/free-solid-svg-icons';

const Play = ({ ...rest }) => {
  return <FontAwesomeIcon icon={faPlay} {...rest} />;
};

export default {
  Play,
};
