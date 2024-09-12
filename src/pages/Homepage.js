import { Link } from 'react-router-dom';



export default function Homepage() {
    return (

        <div className="hmdiv1">
            <h1 className='Hmhead'>Welcome to<span>D</span>ecentralized <span>O</span>nline Voting Software(DOVC)</h1>
            <div className='hmdiv2'><Link to="/register">Register</Link> or <Link to="/login">Login</Link> to continue
            </div>
        </div>
    );
}