import { Button, Modal } from 'antd';
import { useState } from 'react';
import CollapsibleFacets from './CollapsibleFacets';

export default function MobileFacets() {
	const [open, setOpen] = useState(true);

	return (
		<>
			<div
				style={{
					position: 'fixed',
					width: '100%',
					zIndex: '2',
					bottom: '0px',
				}}
			>
				<Button onClick={() => setOpen(true)} style={{ width: '100%' }} type="primary">
					Show Facets
				</Button>
			</div>
			<Modal
				open={open}
				cancelButtonProps={{ style: { display: 'none' } }}
				onCancel={() => setOpen(false)}
				onOk={() => setOpen(false)}
			>
				<div
					style={{
						marginTop: '1rem',
					}}
				>
					<CollapsibleFacets />
				</div>
			</Modal>
		</>
	);
}
