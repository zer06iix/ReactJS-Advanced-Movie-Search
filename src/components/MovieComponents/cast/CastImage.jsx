/* eslint-disable react/prop-types */
export default function CastImage({ member }) {

    return (
        <img
            src={member.profile_path ? `https://image.tmdb.org/t/p/w500${member.profile_path}` : 'placeholder_image_url'}
            alt={member.name}
            className="cast-image"
        />
    )
}