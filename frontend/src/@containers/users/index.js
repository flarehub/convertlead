import { connect } from 'react-redux';
import * as thunks from './thunks';

const mapStateToProps = state => ({
  users: state.users.users,
  pagination: state.users.pagination,
  query: state.users.query,
});

const mapDispatchToProps = dispatch => ({
  loadUsers: () => dispatch(thunks.loadUsers()),
  filterUsers: filters => dispatch(thunks.filterUsers(filters)),
  gotoUserPage: page => dispatch(thunks.gotoUserPage(page)),
  searchUsers: search => dispatch(thunks.searchUsers(search)),
  sort: field => dispatch(thunks.onSort(field)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
);
