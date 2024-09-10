import Image from 'next/image';
import Link from 'next/link';
import activitytop from '../../assets/home_images/activity-top.png';

const ActivityResults = ({ results }) => {
  // Reverse and handle results
  let reversedActivities = Array.isArray(results) ? [...results].reverse() : [];

  return (
    <div className="results-section">
      {reversedActivities === undefined || reversedActivities === null || reversedActivities.length === 0 ? (
        ''
      ) : (
        <>
          <h2>Activities:</h2>
          <div className="top-act-container">
            <div className="inner-w-container">
              <div className="top-act-gridContainer">
                {reversedActivities.slice(0, 8).map((activity, index) => (
                  <Link className="top-act-cardOuter" href={`/activity/${activity.slug.toLowerCase().replace(' ', '-')}`} key={index}>
                    <div className="top-act-card">
                      <div className='image-container-act'>
                        {activity.images && activity.images.length > 0 ? (
                          activity.images.map((e) => (
                            <Image
                              key={e._id}
                              src={`/uploads/${e.name}`}
                              alt={e.title || 'No image'}
                              width={1000}
                              height={1000}
                              className="top-act-image"
                            />
                          ))
                        ) : (
                          <div className="no-image">No image found</div>
                        )}
                        <div className="top-act-duration">{activity.duration}</div>
                      </div>
                      <div className="top-act-Details"
                        style={{
                          backgroundImage: `url('/images/bacrounded.png')`,
                          backgroundSize: 'cover',
                          backgroundRepeat: 'no-repeat'
                        }}>
                        <div className='top-act-icon'>
                          {activity.icon && activity.icon.length > 0 ? (
                            activity.icon.map((e) => (
                              <Image
                                key={e._id}
                                src={`/uploads/${e.name}`}
                                alt={e.title || 'No icon'}
                                width={30}
                                height={30}
                                className='card-icon'
                              />
                            ))
                          ) : (
                            <div className="no-icon">No icon found</div>
                          )}
                        </div>
                        <h3 className="top-act-country">{activity.title}</h3>
                        <p className="top-act-description">{activity.description}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ActivityResults;
