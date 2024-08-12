import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Button, Form, Alert, Container, Row, Col, Table } from 'react-bootstrap';

// Replace with your contract's ABI and deployed address
import RealEstateWaqfTokenData from './abi/RealEstateWaqfToken.json';

const RealEstateWaqf = () => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState('0');
  const [transferTo, setTransferTo] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [message, setMessage] = useState('');
  const [holders, setHolders] = useState([]);
  const [incomeAmount, setIncomeAmount] = useState('');

  const tokenAbi = RealEstateWaqfTokenData.tokenAbi;
  const tokenAddress = RealEstateWaqfTokenData.tokenAddress;

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        try {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
          const contract = new ethers.Contract(tokenAddress, tokenAbi, signer);
  
          setProvider(provider);
          setSigner(signer);
          setContract(contract);
  
          const accounts = await provider.listAccounts();
          setAccount(accounts[0]);
  
          // Wrap the balanceOf call in a try-catch block
          try {
            const balance = await contract.balanceOf(accounts[0]);
            setBalance(ethers.utils.formatEther(balance));
          } catch (error) {
            console.error('Failed to fetch balance:', error);
            setMessage('Failed to fetch balance. Please check the contract details and network connection.');
          }
        } catch (error) {
          console.error('Initialization failed:', error);
          setMessage('Initialization failed. Please check your MetaMask connection and contract details.');
        }
      } else {
        setMessage('Please install MetaMask!');
      }
    };
  
    init();
  }, [tokenAddress, tokenAbi]);
  

  const handleTransfer = async () => {
    try {
      const tx = await contract.transfer(transferTo, ethers.utils.parseEther(transferAmount));
      await tx.wait();
      setMessage('Transfer successful!');
      setBalance(await contract.balanceOf(account));
    } catch (error) {
      setMessage('Transfer failed!');
      console.error(error);
    }
  };

  const handleDistributeIncome = async () => {
    try {
      const tx = await contract.distributeIncome({ value: ethers.utils.parseEther(incomeAmount) });
      await tx.wait();
      setMessage('Income distributed successfully!');
    } catch (error) {
      setMessage('Failed to distribute income!');
      console.error(error);
    }
  };

  const fetchTokenHolders = async () => {
    try {
      const holdersList = [];
      const totalSupply = await contract.totalSupply();
      for (let i = 0; i < totalSupply; i++) {
        const holder = await contract.tokenHolders(i);
        holdersList.push(holder);
      }
      setHolders(holdersList);
    } catch (error) {
      setMessage('Failed to fetch token holders.');
      console.error(error);
    }
  };

  return (
    <Container>
      <Row>
        <Col>
          <h2>Real Estate Waqf Tokenization</h2>
          {message && <Alert variant="info">{message}</Alert>}
        </Col>
      </Row>
      <Row>
        <Col>
          <h4>Your Account: {account}</h4>
          <h4>Your Balance: {balance} AST</h4>
        </Col>
      </Row>
      <Row>
        <Col md={6}>
          <Form>
            <Form.Group controlId="formTransferTo">
              <Form.Label>Transfer To</Form.Label>
              <Form.Control
                type="text"
                placeholder="Recipient address"
                value={transferTo}
                onChange={(e) => setTransferTo(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formTransferAmount">
              <Form.Label>Amount</Form.Label>
              <Form.Control
                type="text"
                placeholder="Amount to transfer"
                value={transferAmount}
                onChange={(e) => setTransferAmount(e.target.value)}
              />
            </Form.Group>
            <Button variant="success" onClick={handleTransfer}>Transfer</Button>
          </Form>
        </Col>
        <Col md={6}>
          <Form>
            <Form.Group controlId="formIncomeAmount">
              <Form.Label>Distribute Income (AST)</Form.Label>
              <Form.Control
                type="text"
                placeholder="Income amount in AST"
                value={incomeAmount}
                onChange={(e) => setIncomeAmount(e.target.value)}
              />
            </Form.Group>
            <Button variant="success" onClick={handleDistributeIncome}>Distribute Income</Button>
          </Form>
        </Col>
      </Row>
      <Row>
        <Col>
          <Button variant="success" onClick={fetchTokenHolders}>Fetch Token Holders</Button>
          {holders.length > 0 && (
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Holder Address</th>
                </tr>
              </thead>
              <tbody>
                {holders.map((holder, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{holder}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default RealEstateWaqf;
