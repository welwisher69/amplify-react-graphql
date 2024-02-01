import brandLogo from './images/Acc_Logo_Black_Purple_RGB.png';
import './App.css';

function Header() {
    return (
        <div className='row'>
          <nav className="navbar navbar-expand-lg navbar-light custom-nav sticky-top">
            <div className="container-fluid">
              <img className ="brand-logo" src={brandLogo} />
              <div className="collapse navbar-collapse" id="navbarScroll">
                <ul className="navbar-nav my-2 my-lg-0 navbar-nav-scroll" style={{'--bs-scroll-height': '100px;'}}>
                  <li className="nav-item">
                      <a className="nav-link " to ="/home"> Home </a> 
                  </li>
                  <li className="nav-item">
                  <a className="nav-link " to ="/about"> About </a>
                  </li>
                </ul>
                <form className="d-flex">
                  <input className="form-control me-2 search-input" type="search" placeholder="What are you looking for?" aria-label="Search"/>
                  <button className="btn search-btn" type="submit">Search</button>
                </form>
              </div>
            </div>
          </nav>
        </div>
    )
}
export default Header;