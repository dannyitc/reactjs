import { connect } from 'src/drivers';
import CreateAccount from './createAccount';
import { createNewUserRequest } from 'src/actions/user';

const mapStateToProps = ({ user }) => {
    const { createAccountError } = user;
    return {
        createAccountError
    };
};

const mapDispatchToProps = { createNewUserRequest };

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CreateAccount);
