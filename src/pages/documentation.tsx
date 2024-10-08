import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, ListGroup, ProgressBar } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const Documentation: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentSectionIndex, setCurrentSectionIndex] = useState<number>(0);

  const sections = [
    {
      title: 'Lagoon: A Harmony of Community and Integrity',
      content: (
        <div style={{ color: '#000', lineHeight: '1.6' }}>
          <h3>Introduction</h3>
          <p>
            Lagoon is more than a name. A vision of harmony and peace. Our decentralized waqf and charity project is dedicated to fostering tranquility within communities through effective and transparent financial support.
          </p>
          <h3>Building a Rich Ecosystem</h3>
          <p>
            Inspired by the diverse life within a lagoon, Lagoon nurtures a vibrant community. Donors and recipients connect and thrive, with community coins and NFTs serving as bridges of support and enrichment. This dynamic ecosystem ensures every contribution has a profound and widespread impact.
          </p>
          <h3>Commitment to Transparency</h3>
          <p>
            Clarity is at the heart of Lagoon. Just as a lagoon, which waters are clear and pure, our processes are transparent and honest. Every donation is traceable, building trust and confidence in our community. We are dedicated to using all resources ethically and efficiently.
          </p>
          <h3>Ensuring Lasting Benefits</h3>
          <p>
            Lagoon is a source of life, providing essential support to those in need. We focus on channeling funds to projects and individuals in a manner that ensures long-term sustainability. Our commitment to efficiency and effectiveness guarantees lasting positive change.
          </p>
          <h3>Conclusion</h3>
          <p>
            Lagoon represents a blend of serenity, community richness, and unwavering integrity. By mirroring the natural beauty and balance of a lagoon, we strive to create a lasting, positive impact on the world, fostering harmony and support in every corner of our community.
          </p>
        </div>
      ),
    },
    {
      title: 'Lagoon: Waqf Web3 Project',
      content: (
        <div style={{ color: '#000', lineHeight: '1.6' }}>
          <h3>Project Overview</h3>
          <p><strong>Project Team Name:</strong> Archipelago Builder</p>
          <p><strong>Project Name:</strong> Lagoon</p>
          <p><strong>Objective:</strong> To incentivize donors with NFTs and tokens when they contribute to charity through our decentralized application (dApp).</p>
          <p><strong>Stakeholders:</strong> Charity Organizations, Donors, Development Team, Marketing Team</p>
          <h3>Requirements</h3>
          <h4>Functional Requirements</h4>
          <ul>
            <li><strong>User Registration and Authentication</strong>
              <ul>
                <li>Users should be able to register using their email or social media accounts.</li>
                <li>Users should authenticate using wallet integration (e.g., MetaMask).</li>
                <li>We are considering KYC to prevent user from making multiple accounts.</li>
              </ul>
            </li>
            <li><strong>Wallet Integration</strong>
              <ul>
                <li>Support for popular wallets like MetaMask, Coinbase Wallet, Rainbow Wallet, and WalletConnect.</li>
                <li>Enable users to view their balance and transaction history within the dApp.</li>
              </ul>
            </li>
            <li><strong>Charity Listing</strong>
              <ul>
                <li>Display a list of participating charity organizations.</li>
                <li>Detailed view of each charity, including mission, projects, and impact.</li>
              </ul>
            </li>
            <li><strong>Donation Process</strong>
              <ul>
                <li>Users should be able to select a charity and specify the amount they wish to donate.</li>
                <li>Process donations in Islamic Coin (ISLM).</li>
              </ul>
            </li>
            <li><strong>Incentive Mechanism</strong>
              <ul>
                <li>Issue NFTs or tokens to donors as incentives. NFT can only be minted every 30 days to prevent multiple minting.</li>
                <li>Provide different tiers of NFTs/tokens based on donation amounts.</li>
                <li>Less than or equals to 1100 ISLM will get the regular NFT.</li>
                <li>More than 1100 ISLM and less than 2200 ISLM will get the gold NFT.</li>
                <li>More than 5500 ISLM will get the diamond NFT.</li>
              </ul>
            </li>
            <li><strong>NFT/Token Management</strong>
              <ul>
                <li>Allow users to view, transfer, or sell their earned NFTs/tokens.</li>
                <li>Integration with NFT marketplaces (e.g., OpenSea).</li>
              </ul>
            </li>
            <li><strong>Transaction Transparency</strong>
              <ul>
                <li>Display real-time transaction details on the blockchain.</li>
                <li>Ensure donors can track the use of their funds by charities.</li>
              </ul>
            </li>
            <li><strong>Reporting and Analytics</strong>
              <ul>
                <li>Provide detailed reports on donations and incentive distributions.</li>
                <li>Enable charities to generate impact reports.</li>
              </ul>
            </li>
          </ul>
          <h4>Non-Functional Requirements</h4>
          <ul>
            <li><strong>Scalability</strong>
              <ul>
                <li>Ensure the dApp can handle a large number of users and transactions concurrently.</li>
              </ul>
            </li>
            <li><strong>Security</strong>
              <ul>
                <li>Implement robust security measures to protect user data and funds.</li>
                <li>Regular security audits and compliance with industry standards.</li>
              </ul>
            </li>
            <li><strong>Performance</strong>
              <ul>
                <li>Optimize the dApp for fast load times and smooth user experience.</li>
              </ul>
            </li>
            <li><strong>Usability</strong>
              <ul>
                <li>Design an intuitive and user-friendly interface.</li>
                <li>Provide multi-language support.</li>
              </ul>
            </li>
            <li><strong>Interoperability</strong>
              <ul>
                <li>Ensure compatibility with various blockchain networks and wallets.</li>
                <li>Support for cross-chain transactions.</li>
              </ul>
            </li>
          </ul>
          <h3>System Architecture</h3>
          <h4>Frontend</h4>
          <p><strong>Technologies:</strong> Rainbowkit, Wagmi, Next.js</p>
          <p><strong>Features:</strong></p>
          <ul>
            <li>Responsive design for mobile and desktop.</li>
            <li>Integration with wallet providers.</li>
            <li>User-friendly donation interface.</li>
          </ul>
          <h4>Backend</h4>
          <p><strong>Technologies:</strong> Node.js, Express.js</p>
          <p><strong>Features:</strong></p>
          <ul>
            <li>API for handling user data, donations, and incentive management.</li>
            <li>Integration with blockchain networks (Haqq Network).</li>
            <li>Secure storage of user data.</li>
          </ul>
          <h4>Smart Contracts</h4>
          <p><strong>Technologies:</strong> Solidity, Hardhat</p>
          <p><strong>Features:</strong></p>
          <ul>
            <li>ERC-20 token contract for donor incentives.</li>
            <li>ERC-721/1155 contract for NFT issuance.</li>
            <li>Secure and auditable donation processing.</li>
          </ul>
          <h4>Blockchain Network</h4>
          <p><strong>Primary Network:</strong> Haqq Mainnet</p>
          <p><strong>Layer 2 Solutions:</strong> Polygon, Optimism (for scalability)</p>
          <h3>User Flow</h3>
          <ul>
            <li><strong>Registration/Login</strong>
              <ul>
                <li>Users register and link their wallet.</li>
                <li>Users log in to access their dashboard.</li>
              </ul>
            </li>
            <li><strong>Charities Catalogue</strong>
              <ul>
                <li>User browses the list of available charities.</li>
                <li>Users view detailed information about a selected charity.</li>
              </ul>
            </li>
            <li><strong>Making a Donation</strong>
              <ul>
                <li>User selects a charity and specifies the donation amount.</li>
                <li>User confirms the transaction through their wallet.</li>
              </ul>
            </li>
            <li><strong>Receiving Incentives</strong>
              <ul>
                <li>Upon successful donation, the user receives an NFT or token.</li>
                <li>Users view their earned NFTs/tokens in their profile.</li>
              </ul>
            </li>
            <li><strong>Managing NFTs/Tokens</strong>
              <ul>
                <li>Users can transfer or sell their NFTs/tokens.</li>
                <li>Integration with NFT marketplaces for trading.</li>
              </ul>
            </li>
          </ul>
          <h3>Security Considerations</h3>
          <ul>
            <li><strong>Smart Contract Security</strong>
              <ul>
                <li>Conduct thorough audits of smart contracts by reputable firms.</li>
                <li>Implement multi-signature for contract upgrades.</li>
              </ul>
            </li>
            <li><strong>User Data Protection</strong>
              <ul>
                <li>Encrypt sensitive user data.</li>
                <li>Implement GDPR compliance for data handling.</li>
              </ul>
            </li>
            <li><strong>Transaction Security</strong>
              <ul>
                <li>Use secure protocols for transaction processing.</li>
                <li>Monitor for suspicious activities and implement anti-fraud measures.</li>
              </ul>
            </li>
          </ul>
          <h3>Development and Deployment</h3>
          <h4>Development Tools</h4>
          <p><strong>Version Control:</strong> Git, GitHub/GitLab</p>
          <p><strong>Development Framework:</strong> Hardhat for smart contracts, React.js for frontend</p>
          <p><strong>Testing Framework:</strong> Mocha, Chai for smart contracts, Vercel for frontend</p>
          <h4>Deployment</h4>
          <p><strong>Smart Contracts:</strong> Deploy on Haqq Mainnet.</p>
          <p><strong>Frontend and Backend:</strong> Host on cloud platforms.</p>
          <h4>Timeline and Milestones</h4>
          <ul>
            <li><strong>Phase 1: Requirements and Design (1 week)</strong>
              <ul>
                <li>Gather requirements from stakeholders.</li>
                <li>Design system architecture and user interface.</li>
              </ul>
            </li>
            <li><strong>Phase 2: Development (2 weeks)</strong>
              <ul>
                <li>Develop smart contracts and backend services.</li>
                <li>Implement frontend components and wallet integration.</li>
              </ul>
            </li>
            <li><strong>Phase 3: Testing & Deploy (1 week)</strong>
              <ul>
                <li>Conduct unit and integration testing.</li>
                <li>Perform security audits of smart contracts.</li>
                <li>Deploy smart contracts on testnet.</li>
                <li>Launch the dApp and conduct initial user testing.</li>
              </ul>
            </li>
            <li><strong>3 Days Extension</strong>
              <ul>
                <li>We implement better UX and added DAO voting mechanism</li>
              </ul>
            </li>
          </ul>
          <h3>Conclusion</h3>
          <p>
            The Lagoon Waqf Web3 Project aims to revolutionize the way donations are made and incentivized using blockchain technology. By providing donors with NFTs and tokens, we not only encourage more contributions but also create a transparent and rewarding experience for all stakeholders. The successful implementation of this project will depend on robust security measures, user-friendly design, and seamless integration with blockchain networks.
          </p>
        </div>
      ),
    },
    {
      title: 'Tokenomics',
      content: (
        <div style={{ color: '#000', lineHeight: '1.6' }}>
          <h3>Tokenomics</h3>
          <p>
            The Lagoon tokenomics is structured to incentivize participation and ensure sustainability. Our community coins are used for transactions, rewards, and governance, creating a balanced and equitable economic system.
          </p>
        </div>
      ),
    },
    {
      title: 'NFT',
      content: (
        <div style={{ color: '#000', lineHeight: '1.6' }}>
          <h3>NFT</h3>
          <p>
            Non-Fungible Tokens (NFTs) play a crucial role in the Lagoon ecosystem. They represent ownership and contributions, providing a unique way for donors to be recognized and for recipients to showcase their gratitude.
          </p>
        </div>
      ),
    },
    {
      title: 'Asset Tokenization',
      content: (
        <div style={{ color: '#000', lineHeight: '1.6' }}>
          <h3>Asset Tokenization</h3>
          <p>
          Asset tokenization has the potential to revolutionize the concept of WAQF, an Islamic endowment traditionally used for charitable and religious purposes. By leveraging blockchain technology, WAQF can be modernized to increase transparency, accessibility, and efficiency in managing charitable assets, thereby enhancing the impact of Islamic philanthropy.
          </p>
          <p><strong>Understanding Waqf</strong></p>
          <p>WAQF is a long-standing Islamic practice where an individual dedicates a portion of their wealth, such as land, buildings, or other assets, for the benefit of the community. The principal asset is preserved, and the income generated is used for charitable purposes, such as building schools, hospitals, or providing social services. Historically, managing WAQF assets has been challenging due to issues like mismanagement, lack of transparency, and limited accessibility.</p>
          <p><strong>The Role of Asset Tokenization in Waqf</strong></p>
          <p>Asset tokenization can address these challenges by digitizing WAQF assets and issuing tokens that represent fractional ownership or benefit rights. These tokens are recorded on a blockchain, ensuring secure, transparent, and immutable records of ownership and transactions. How asset tokenization can transform Waqf:
            <li><strong>Enhanced Transparency and Accountability:</strong>Blockchain technology provides a transparent ledger of all transactions related to WAQF assets. Donors and stakeholders can easily track how the funds or assets are being used, ensuring that the WAQF is managed according to Islamic principles and the wishes of the endower.</li>
            <li><strong>Automated Management through Smart Contracts:</strong> Smart contracts can be used to automate the management of WAQF assets. For instance, the income generated from a WAQF property could be automatically distributed to designated beneficiaries according to predefined rules. This reduces the administrative burden and ensures that the WAQF operates efficiently and in accordance with the endowers wishes.</li>
          </p>
        </div>
      ),
    },
    {
      title: 'Secure Transactions',
      content: (
        <div style={{ color: '#000', lineHeight: '1.6' }}>
          <h3>Secure Transactions</h3>
          <p>
          Ensuring secure transactions is paramount to maintain the trust of donors, beneficiaries, and the broader community. Blockchain technology inherently offers several security features, but careful implementation and management are necessary to protect the integrity of the Waqf and its assets.</p>
          <strong>Key Security Aspects in Blockchain Transactions</strong>
          <li><strong>Immutable Ledger:</strong>The core feature of blockchain is its immutable ledger, where all transactions are recorded permanently and cannot be altered. This ensures that once a transaction is made—whether it is the donation of an asset, the issuance of tokens, or the distribution of funds—it is securely recorded and visible to all participants.</li>
          <li><strong>Decentralization:</strong>The decentralized nature of blockchain reduces the risk of a single point of failure. This means that the WAQF assets are not controlled by a single entity, which helps prevent fraud and ensures that the assets are managed transparently.</li>
        </div>
      ),
    },
    {
      title: 'Low Fees',
      content: (
        <div style={{ color: '#000', lineHeight: '1.6' }}>
          <h3>Low Fees</h3>
          <p>
          The HAQQ network, designed with ethical finance and Islamic principles in mind, provides a blockchain platform that is both secure and efficient. To maximize the impact of Waqf assets on this network, minimizing transaction fees is essential. 
          </p>
        </div>
      ),
    },
    {
      title: 'Global Reach',
      content: (
        <div style={{ color: '#000', lineHeight: '1.6' }}>
          <h3>Global Reach</h3>
          <p>
          Tokenization allows WAQF to attract contributions from a global audience, not just from the local community. This can lead to larger pools of resources being dedicated to charitable causes, significantly amplifying the impact of the WAQF.</p>
        </div>
      ),
    },
  ];

  const filteredSections = sections.filter(section =>
    section.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentSection = filteredSections[currentSectionIndex];

  const nextSection = () => {
    if (currentSectionIndex < filteredSections.length - 1) {
      setCurrentSectionIndex(currentSectionIndex + 1);
    }
  };

  const prevSection = () => {
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex(currentSectionIndex - 1);
    }
  };

  return (
    <Container fluid>
      <Row>
        <Col md={3} className="bg-light p-4">
          <h4 className="text-dark">Documentation</h4>
          <Form.Control
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-3"
          />
          <ListGroup variant="flush">
            {filteredSections.map((section, index) => (
              <ListGroup.Item
                key={index}
                action
                onClick={() => setCurrentSectionIndex(index)}
                active={index === currentSectionIndex}
                style={{
                  backgroundColor: index === currentSectionIndex ? '#28a745' : 'transparent',
                  color: index === currentSectionIndex ? '#fff' : '#000',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                {section.title}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>
        <Col md={9} className="p-4" style={{ backgroundColor: '#fff' }}>
          <h2 style={{ color: '#28a745' }}>{currentSection.title}</h2>
          {currentSection.content}
          <ProgressBar variant="success" now={((currentSectionIndex + 1) / filteredSections.length) * 100} className="mt-4" />
          <div className="d-flex justify-content-between mt-4">
            <Button onClick={prevSection} disabled={currentSectionIndex === 0} variant="secondary">
              Previous
            </Button>
            <Button onClick={nextSection} disabled={currentSectionIndex === filteredSections.length - 1} style={{ backgroundColor: '#28a745', borderColor: '#28a745', color: '#fff' }}>
              Next
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Documentation;