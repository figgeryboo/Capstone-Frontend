import React from 'react';
import logo from '../../public/WMICLOGO.png';
import { useLocation } from 'react-router-dom';

const fontStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Bagel+Fat+One&family=Gloria+Hallelujah&display=swap');
`;

const HeaderWithConditionalRendering = () => {
	const location = useLocation();

	const excludeHeaderPaths = [
		'/',
		'/userlogin',
		'/usersignup',
		'/vendorlogin',
		'/vendorsignup',
	];
	const shouldRenderHeader = !excludeHeaderPaths.includes(location.pathname);

	if (!shouldRenderHeader) {
		return null;
	}

	return (
		<>
			<style>{fontStyles}</style>
			<header
				style={{
					backgroundColor: '#BCF4EF',
					padding: '10px 20px',
					position: 'fixed',
					top: 0,
					left: 0,
					width: '100%',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
					zIndex: 1000,
					fontFamily: 'Bagel Fat One, cursive',
				}}
			>
				<img
					src={logo}
					alt="Where's My Ice Cream?"
					style={{ maxWidth: '100px', height: 'auto' }}
				/>
				<h3 style={{ fontFamily: 'Bagel Fat One, cursive' }}>
					Where's My Ice Cream?
				</h3>
			</header>
		</>
	);
};

export default HeaderWithConditionalRendering;
