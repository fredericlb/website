import { Component } from 'preact';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from '~/actions';
import { route }   from 'preact-router';
import { ProgressBar } from 'react-toolbox/lib/progress_bar';


class Page extends Component {

  static async prefetch(lang, slug, dispatch) {
    return Page.loadData(lang, Page.getFullSlug(lang, slug), {
      getPage: fullSlug => dispatch(actions.getPage(fullSlug)),
    });
  }

  static getFullSlug(lang, slug) {
    return `${lang.toLowerCase()}-${slug.toLowerCase()}`;
  }

  static async loadData(lang, fullSlug, actions) {
    try {
      await actions.getPage(fullSlug);
    }
    catch (e) {
      console.error(e);
      route(`/${lang}/404`);
    }
  }

  createMarkup() {
    return {
      __html: this.props.pages[Page.getFullSlug(this.props.lang, this.props.slug)].content,
    };
  }

  componentDidMount () {
    const fullSlug = Page.getFullSlug(this.props.lang, this.props.slug);
    if (this.props.pages[fullSlug] === undefined) {
      Page.loadData(this.props.lang, fullSlug, this.props.actions);
    }
  }

  render () {
    const fullSlug = Page.getFullSlug(this.props.lang, this.props.slug);
    if (this.props.pages[fullSlug] === undefined || this.props.pages[fullSlug].isLoading) {
      return (
        <div class="content text-center">
          <ProgressBar type="circular" mode="indeterminate" />
        </div>
      );
    }
    return (
      <div className={'wp-content'} dangerouslySetInnerHTML={this.createMarkup()} />
    );

  }
}

function mapStateToProps(args) {
  const { pages } = args;

  return {
    pages,
  };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(Page);
