import { Component } from 'preact';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from '~/actions';
import { route }   from 'preact-router';
import { ProgressBar } from 'react-toolbox/lib/progress_bar';
import Helmet from 'preact-helmet';


class Page extends Component {
  static async prefetch(lang, slug, dispatch) {
    return Page.loadData(lang, Page.getFullSlug(lang, slug), {
      getPage: fullSlug => dispatch(actions.getPage(fullSlug)),
    });
  }

  static getFullSlug(lang, slug) {
    return `${lang.toLowerCase()}-${slug.toLowerCase()}`;
  }

  static async loadData(lang, fullSlug, actions, noRedirect) {
    try {
      await actions.getPage(fullSlug);
    }
    catch (e) {
      if (!noRedirect && e.error.isNotFound) {
        route(`/${lang}/404`);
      }
      else {
        throw e;
      }
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
      Page.loadData(this.props.lang, fullSlug, this.props.actions, this.props.noRedirect);
    }
  }

  render () {
    const fullSlug = Page.getFullSlug(this.props.lang, this.props.slug);
    const page = this.props.pages[fullSlug];

    if ( page === undefined || page.isLoading) {
      return (
        <div className="content text-center">
          <ProgressBar type="circular" mode="indeterminate" />
        </div>
      );
    }

    return (
      <div>
        <Helmet
          title={page.yoast_meta.yoast_wpseo_title || ''}
          meta={[{
            name: 'description',
            content: page.yoast_meta.yoast_wpseo_metadesc,
          }].concat(this.props.i18nMeta).filter(Boolean)}
        />
        <h1>{page.title.rendered}</h1>
        <div className={'wp-content'} dangerouslySetInnerHTML={this.createMarkup()} />
      </div>
    );

  }
}

function mapStateToProps({ pages }) {
  return { pages };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(Page);
