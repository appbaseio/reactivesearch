const PopularSvg = {
    name: 'PopularSvg',
    props: ['className', 'icon'],
    data() {
        return {
            recent: this.$props.icon(),
        }
        },
    render() {
        if (this.recent) {
            return (
                <div class={this.$props.className}>
                    {this.recent}
                </div>
                );
        }
        return (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                alt="Popular Searches"
                height="20"
                width="20"
                viewBox="0 0 24 24"
                class={this.$props.className}
            >
                <path d="M0 0h24v24H0z" fill="none"/>
                <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/>
            </svg>
        )
    },
};

export default PopularSvg;
