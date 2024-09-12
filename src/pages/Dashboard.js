import Web3 from "web3";
import { useEffect, useState } from "react"
import { useNavigate, Navigate } from "react-router-dom"
import NavBar from "../components/NavBar"
import { UserDetailsApi } from "../services/Api"
import { logout, isAuthenticated } from "../services/Auth"
import './Dashboard.css';

const CONTRACT_ADDR = '0xDA0180663042c8f367DA17D8D25c80fdF41fD88b';
const CONTRACT_ABI = ([
	{
		"inputs": [
			{
				"internalType": "string[]",
				"name": "_candidateName",
				"type": "string[]"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "candidateId",
				"type": "uint256"
			}
		],
		"name": "vote",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "candidateCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "candidates",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "voteCount",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "candidateId",
				"type": "uint256"
			}
		],
		"name": "getVoteCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "hasVoted",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]);

export default function DashboardPage() {
    const navigate = useNavigate();

    const [user, setUser] = useState({ name: "", email: "", localId: "" });
    const [account, setAccount] = useState('');
    const [candidates, setCandidates] = useState([]);

    useEffect(() => {
        if (isAuthenticated()) {
            UserDetailsApi().then((response) => {
                setUser({
                    name: response.data.users[0].displayName,
                    email: response.data.users[0].email,
                    localId: response.data.users[0].localId,
                });
            });
        }

        const loadWeb3 = async () => {
            if (window.ethereum) {
                window.web3 = new Web3(window.ethereum);
                try {
                    await window.ethereum.request({ method: 'eth_requestAccounts' });
                    const accounts = await window.web3.eth.getAccounts();
                    setAccount(accounts[0]);
                    console.log(accounts[0]);
                } catch (error) {
                    console.error('User denied account access');
                }
            } else {
                alert('Please install MetaMask');
            }
        };

        loadWeb3();
        loadCandidates();
    }, []);

    const loadCandidates = async () => {
        const contract = new window.web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDR);
        const candidateCount = await contract.methods.candidateCount().call();
        const candidatesArray = [];
        for (let i = 1; i <= candidateCount; i++) {
            const candidate = await contract.methods.candidates(i).call();
            console.log(candidate);
            candidatesArray.push(candidate);
        }
        setCandidates(candidatesArray);
    };

    const vote = async (candidateId) => {
        try {
            const contract = new window.web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDR);
            const transaction = {
                from: account,
                to: CONTRACT_ADDR,
                data: contract.methods.vote(candidateId).encodeABI(),
                gas: 320000,
            };
            const receipt = await window.web3.eth.sendTransaction(transaction);
            console.log('Transaction Hash:', receipt.transactionHash);

            loadCandidates();
        } catch (error) {
            console.error(error);
        }
    };

    const logoutUser = () => {
        logout();
        navigate('/login');
    };

    if (!isAuthenticated()) {
        return <Navigate to="/login" />;
    }

    return (
        <div>
            <NavBar logoutUser={logoutUser} />
            <main role="main" className="container mt-5">
                <div className="container-flow">
                    <div className="text-center mt-5">
                        <h3>Dashboard page</h3>
                        {user.name && user.email && user.localId ? (
                            <div>
                                <p className="text-bold ">Hi {user.name}, Welcome to voting Dapp</p>
                                <p>Your email is {user.email}</p>
                            </div>
                        ) : <p>Loading...</p>}
                    </div>
                </div>
            </main>
            <div className="tabdiv">
               <center><div>
                    <h1>Voting Ballot</h1>
                    <table>
                        <thead>
                            <tr>
                                <th>Candidates</th>
                                <th>Votes</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {candidates.map(candidate => (
                                <tr key={candidate.id}>
                                    <td>{candidate.name}</td>
                                    <td>{candidate.voteCount}</td>
                                    <td><button className="btn" onClick={() => vote(candidate.id)}>Vote</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div></center>
            </div>
        </div>
    );
}
