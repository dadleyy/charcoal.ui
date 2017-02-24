import resource from 'charcoal/lib/resource';
import ENV from 'charcoal/config/environment';

const { API_HOME } = ENV;

export default resource(`${API_HOME}/game-memberships`);
