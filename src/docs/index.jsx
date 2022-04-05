import React from "react";
import { render } from "react-dom";
import { AppleMaps, Annotation } from "../../lib";
import "./styles.css";
import { CurrentLocationOverride } from "../lib";

const MAPKITJS_TOKEN = process.env.MAPKITJS_TOKEN

function Demo() {
	return (
		<div style={{ width: "100%", height: "100vh" }}>
			<AppleMaps
				token={MAPKITJS_TOKEN}
				width="100%"
				height="100%"
				latitude={53.8008}
				longitude={-1.5491}
				zoomLevel={6}
			>
				<Annotation
					id="apple"
					latitude={53.7967}
					longitude={-1.5438}
					color="#969696"
					title="Apple"
					subtitle="work"
					selected={true}
					glyphText=""
				/>
				<Annotation
					id="leeds"
					latitude={53.7950}
					longitude={-1.5474}
					color="red"
					title="Rail Station"
					subtitle="Leeds"
					glyphImage='./assets/railicon.png'
				/>
				<CurrentLocationOverride 
					latitude={53.7158}
					longitude={-1.4017}
					direction={90}
				/>
			</AppleMaps>
		</div>
	);
}

render(<Demo />, document.getElementById("app"));
