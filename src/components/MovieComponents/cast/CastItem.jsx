/* eslint-disable react/prop-types */
import CastImage from "./CastImage";

export default function CastItem({ member, castKey }) {

    return (
        <div key={castKey} className="cast-member">
            <CastImage member={member}/>
            <p className="cast-name">{member.name}</p>
            <p className="cast-character-name">{member.character || 'Unknown Character'}</p>
        </div>
    )
}