pragma solidity ^0.4.25;

contract ERC20 {
    function totalSupply() public constant returns (uint supply); // 总供应量
    function balanceOf( address who ) public constant returns (uint value); // 指定账号余额
    function allowance( address owner, address spender ) public constant returns (uint _allowance); // 限额

    function transfer( address to, uint value) public returns (bool ok); // 转账
    function transferFrom( address from, address to, uint value) public returns (bool ok); // 从他人处转账
    function approve( address spender, uint value ) public returns (bool ok); // 设置允许量值

    event Transfer( address indexed from, address indexed to, uint value); // 转账事件
    event Approval( address indexed owner, address indexed spender, uint value); // 允许事件
}

contract MyToken is ERC20 {
    string public name;  // 代币名称
    string public symbol; // 代币符号
    uint8 public decimals = 2; // 小数点位

    address _cfo;
    mapping (address => uint256) _balances;
    uint256 _supply;
    mapping (address => mapping (address => uint256)) _approvals;

    constructor (string n, string s, uint8 d, uint256 supply) public {
        name = n;
        symbol = s;
        decimals = d;
        _cfo = msg.sender;
        _supply = supply * 10 ** uint256(d);
        _balances[_cfo] = _supply;
    }

    modifier onlyCFO() {
        require(msg.sender == _cfo);
        _;
    }

    function totalSupply() public constant returns (uint256) {
        return _supply;
    }

    function balanceOf(address src) public constant returns (uint256) {
        return _balances[src];
    }

    function allowance(address src, address guy) public constant returns (uint256) {
        return _approvals[src][guy];
    }

    function transfer(address dst, uint wad) public returns (bool) {
        assert(_balances[msg.sender] >= wad);

        _balances[msg.sender] = _balances[msg.sender] - wad;
        _balances[dst] = _balances[dst] + wad;

        emit Transfer(msg.sender, dst, wad);

        return true;
    }

    function transferFrom(address src, address dst, uint wad) public returns (bool) {
        assert(_balances[src] >= wad);
        assert(_approvals[src][msg.sender] >= wad);

        _approvals[src][msg.sender] = _approvals[src][msg.sender] - wad;
        _balances[src] = _balances[src] - wad;
        _balances[dst] = _balances[dst] + wad;

        emit Transfer(src, dst, wad);

        return true;
    }

    function approve(address guy, uint256 wad) public returns (bool) {
        _approvals[msg.sender][guy] = wad;

        emit Approval(msg.sender, guy, wad);

        return true;
    }
}
