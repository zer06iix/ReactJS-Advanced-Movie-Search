import useTabStore from '../../store/tabStore';

export default function NavIndicator({ width }) {
    const { activeTabIndex: i, tabWidths } = useTabStore();

    const indicatorOffset = -20;
    const tabWidthOffset = tabWidths
        .slice(0, i)
        .reduce((acc, width) => acc + width, 0);

    return (
        <div
            className="nav-indicator"
            style={{
                width: tabWidths[i] + indicatorOffset * 2,
                transform: `translate(
                calc(${i} * 30px + ${tabWidthOffset}px + ${-indicatorOffset}px),
                calc(-50% - 50px)
                )`
            }}
        ></div>
    );
}
